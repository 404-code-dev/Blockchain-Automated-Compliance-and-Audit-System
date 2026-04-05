import logging
import random
logger = logging.getLogger(__name__)
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from pathlib import Path
import hashlib
import json
from app.services.user_service import find_user_by_reg_no
from app.compliance.engine import evaluate
from app.services.audit_service import create_audit_log
from app.blockchain.connector import get_onchain_hash
from app.core.security import (
    get_current_user,
    verify_password,
    create_access_token,
    hash_password
)
from app.db.mongo import db, students_collection, teachers_collection, admins_collection

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"
FALLBACK_RULE = {"rule_id": "N/A", "severity": "N/A"}

# Fixed subjects — same as existing students in your DB
SUBJECTS = ["CSE401", "CSE402", "CSE403", "CSE404", "CSE405"]

def generate_random_marks():
    return {s: random.randint(45, 98) for s in SUBJECTS}

def generate_random_attendance():
    return {s: random.randint(60, 100) for s in SUBJECTS}

def load_json(filename: str):
    file_path = STORAGE_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=500, detail=f"{filename} not found")
    with open(file_path, "r") as f:
        return json.load(f)

def handle_violation(action_type, current_user, rule):
    return create_audit_log(
        {
            "action_type": action_type,
            "actor":       current_user["registration_number"],
            "role":        current_user["role"],
            "decision":    "BLOCKED",
        },
        rule,
    )

def handle_allowed(action_type, current_user, rule=None, target_reg_no=None):
    payload = {
        "action_type": action_type,
        "actor":       current_user["registration_number"],
        "role":        current_user["role"],
        "decision":    "ALLOWED",
    }
    if target_reg_no is not None:
        payload["target"] = target_reg_no
    return create_audit_log(payload, rule or FALLBACK_RULE)


class Action(BaseModel):
    action_type: str

class ModifyMarksRequest(BaseModel):
    registration_number: int
    course: str
    marks: int

class AttendanceRequest(BaseModel):
    registration_number: int
    course: str
    attendance: int

class ApproveResultRequest(BaseModel):
    registration_number: int

class LoginRequest(BaseModel):
    registration_number: int
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

class AddUserRequest(BaseModel):
    registration_number: int
    name: str
    password: str
    role: str
    department: str = ""
    year: int = None
    phone: str = ""
    address: str = ""
    dob: str = ""
    gender: str = ""


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    if not payload.registration_number or not payload.password:
        raise HTTPException(status_code=400, detail="Missing credentials")
    logger.info(f"Login attempt for {payload.registration_number}")
    user = find_user_by_reg_no(payload.registration_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid password")
    token = create_access_token({
        "sub":  str(user["registration_number"]),
        "role": user["role"].upper(),
    })
    logger.info(f"Login success: {payload.registration_number}")
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def get_current_user_data(current_user: dict = Depends(get_current_user)):
    user = current_user.copy()
    user["registration_number"] = int(user.get("registration_number"))
    return {
        "registration_number": user.get("registration_number"),
        "name":                user.get("name"),
        "department":          user.get("department"),
        "year":                user.get("year"),
        "role":                user.get("role"),
        "marks":               user.get("marks", {}),
        "attendance":          user.get("attendance", {}),
        "address":             user.get("address"),
        "dob":                 user.get("dob"),
        "phone":               user.get("phone"),
        "gender":              user.get("gender"),
        "result_status":       user.get("result_status"),
    }


@router.post("/action")
def action(req: Action, current_user: dict = Depends(get_current_user)):
    result = evaluate(req.action_type, current_user["role"])
    if result["status"] == "VIOLATION":
        audit = handle_violation(req.action_type, current_user, result["rule"])
        return {"status": "BLOCKED", "message": "Policy violation detected", "audit": audit}
    handle_allowed(req.action_type, current_user, result.get("rule"))
    return {
        "status":       "ALLOWED",
        "message":      "Action permitted",
        "performed_by": current_user["registration_number"],
    }

@router.post("/modify-marks")
def modify_marks_endpoint(
    req: ModifyMarksRequest,
    current_user: dict = Depends(get_current_user),
):
    logger.info(f"Modify marks attempt by {current_user['registration_number']}")

    if req.marks < 0 or req.marks > 100:
        raise HTTPException(status_code=400, detail="Marks must be between 0 and 100")
    if not req.course:
        raise HTTPException(status_code=400, detail="Course is required")

    # Let compliance engine decide — this logs the violation properly
    result = evaluate("MODIFY_MARKS", current_user["role"])

    if result["status"] == "VIOLATION":
        audit = handle_violation("MODIFY_MARKS", current_user, result["rule"])
        return {
            "status":  "BLOCKED",
            "message": "You are not authorized to modify marks.",
            "log_id":  audit["log_id"],
            "audit":   audit,
        }

    # Only TEACHER/ADMIN reach here
    update = students_collection.update_one(
        {"registration_number": req.registration_number},
        {"$set": {f"marks.{req.course}": req.marks}},
    )
    if update.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    handle_allowed("MODIFY_MARKS", current_user, result.get("rule"), target_reg_no=req.registration_number)
    logger.info(f"Marks updated for {req.registration_number} by {current_user['registration_number']}")
    return {
        "status":     "SUCCESS",
        "message":    "Marks updated successfully",
        "updated_by": current_user["registration_number"],
    }


@router.post("/update-attendance")
def attendance_endpoint(
    req: AttendanceRequest,
    current_user: dict = Depends(get_current_user),
):
    if req.attendance < 0 or req.attendance > 100:
        raise HTTPException(status_code=400, detail="Attendance must be between 0 and 100")
    if not req.course:
        raise HTTPException(status_code=400, detail="Course is required")
    result = evaluate("UPDATE_ATTENDANCE", current_user["role"])

    if result["status"] == "VIOLATION":
        audit = handle_violation("UPDATE_ATTENDANCE", current_user, result["rule"])
        return {
            "status":  "BLOCKED",
            "message": "You are not authorized to update attendance.",
            "log_id":  audit["log_id"],
            "audit":   audit,
        }

    update = students_collection.update_one(
        {"registration_number": req.registration_number},
        {"$set": {f"attendance.{req.course}": req.attendance}},
    )
    if update.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    handle_allowed("UPDATE_ATTENDANCE", current_user, result.get("rule"), target_reg_no=req.registration_number)
    return {
        "status":     "SUCCESS",
        "message":    "Attendance updated successfully",
        "updated_by": current_user["registration_number"],
    }

@router.post("/approve-result")
def approve_result_endpoint(
    req: ApproveResultRequest,
    current_user: dict = Depends(get_current_user),
):
    result = evaluate("APPROVE_RESULTS", current_user["role"])
    if result["status"] == "VIOLATION":
        audit = handle_violation("APPROVE_RESULTS", current_user, result["rule"])
        return {"status": "BLOCKED", "message": "Unauthorized result approval attempt", "audit": audit}

    update = students_collection.update_one(
        {"registration_number": req.registration_number},
        {"$set": {"result_status": "APPROVED"}},
    )
    if update.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    handle_allowed("APPROVE_RESULTS", current_user, result.get("rule"), target_reg_no=req.registration_number)
    return {
        "status":      "SUCCESS",
        "message":     "Result approved successfully",
        "approved_by": current_user["registration_number"],
    }


@router.post("/add-user")
def add_user(req: AddUserRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can add users")

    role = req.role.upper()
    if role not in ["STUDENT", "TEACHER", "ADMIN"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    collection_map = {
        "STUDENT": students_collection,
        "TEACHER": teachers_collection,
        "ADMIN":   admins_collection,
    }
    collection = collection_map[role]

    print(f"[ADD USER] {role}: {req.name} ({req.registration_number})")
    print(f"[ADD USER] DB: {collection.database.name}  Collection: {collection.name}")

    existing = collection.find_one({"registration_number": req.registration_number})
    if existing:
        raise HTTPException(status_code=409, detail="Registration number already exists")

    doc = {
        "registration_number": req.registration_number,
        "name":                req.name,
        "password_hash":       hash_password(req.password),
        "role":                role,
        "department":          req.department,
    }

    if role == "STUDENT":
        marks      = generate_random_marks()
        attendance = generate_random_attendance()
        print(f"[ADD USER] marks={marks}")
        print(f"[ADD USER] attendance={attendance}")
        doc.update({
            "year":          req.year,
            "phone":         req.phone,
            "address":       req.address,
            "dob":           req.dob,
            "gender":        req.gender,
            "marks":         marks,
            "attendance":    attendance,
            "result_status": "PENDING",
        })

    try:
        result = collection.insert_one(doc)
        print(f"[ADD USER] Inserted _id={result.inserted_id}")
        verify = collection.find_one({"_id": result.inserted_id})
        if verify:
            print(f"[ADD USER] CONFIRMED in {collection.database.name}.{collection.name}: {verify['name']}")
        else:
            print("[ADD USER] WARNING: insert reported success but document not found on re-query!")
    except Exception as e:
        print(f"[ADD USER] MONGO ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "status":  "SUCCESS",
        "message": f"{role} '{req.name}' added successfully.",
    }


@router.get("/verify/{log_id}")
def verify(log_id: str):
    logger.info(f"Verification requested for log_id: {log_id}")
    log = db["audit_logs"].find_one({"log_id": log_id})
    if not log:
        return {"status": "NOT_FOUND"}

    hash_input = json.dumps({
        "log_id":      log.get("log_id"),
        "timestamp":   log.get("timestamp"),
        "actor":       log.get("actor"),
        "action_type": log.get("action_type"),
        "rule_id":     log.get("rule_id"),
        "decision":    log.get("decision"),
    }, sort_keys=True)

    recalculated_hash = hashlib.sha256(hash_input.encode()).hexdigest()
    stored_hash       = log.get("hash")
    blockchain_hash   = None
    blockchain_valid  = False

    if log.get("blockchain_tx"):
        try:
            blockchain_hash  = get_onchain_hash(log.get("blockchain_tx"))
            blockchain_valid = stored_hash == blockchain_hash
        except Exception as e:
            logger.error(f"Blockchain fetch error for {log_id}: {e}")
            blockchain_valid = False

    integrity_valid = recalculated_hash == stored_hash
    final_status    = "VERIFIED" if integrity_valid and blockchain_valid else "TAMPERED"

    return {
        "status":           final_status,
        "integrity_check":  "PASS" if integrity_valid else "FAIL",
        "blockchain_check": "PASS" if blockchain_valid else "FAIL",
        "details": {
            "local_hash":        stored_hash,
            "recalculated_hash": recalculated_hash,
            "blockchain_hash":   blockchain_hash,
        },
    }


@router.get("/health")
def health():
    return {"status": "OK"}


@router.get("/audit-logs")
def get_audit_logs(
    current_user: dict = Depends(get_current_user),
    actor: str = Query(None, description="Filter by registration number (actor or target)"),
):
    role    = current_user["role"]
    my_reg  = str(current_user["registration_number"])
    student_actions = ["MODIFY_MARKS", "UPDATE_ATTENDANCE", "APPROVE_RESULTS"]

    if role == "ADMIN":
        if actor:
            query = {"$or": [{"actor": actor}, {"target": actor}]}
        else:
            query = {}
        logs = list(db["audit_logs"].find(query, {"_id": 0}))

    elif role == "TEACHER":
        if actor:
            query = {
                "$or": [
                    {"actor": my_reg},
                    {"action_type": {"$in": student_actions}, "target": actor},
                    {"action_type": {"$in": student_actions}, "actor": actor},
                ]
            }
        else:
            query = {
                "$or": [
                    {"actor": my_reg},
                    {"action_type": {"$in": student_actions}},
                ]
            }
        logs = list(db["audit_logs"].find(query, {"_id": 0}))

    else:
        raise HTTPException(status_code=403, detail="Not authorized to view audit logs")

    for log in logs:
        for field in ("actor", "target"):
            if field in log:
                log[field] = str(log[field])

    logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return logs


@router.get("/student/{reg_no}")
def get_student_by_id(reg_no: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["TEACHER", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    student = students_collection.find_one(
        {"registration_number": int(reg_no)},
        {"_id": 0, "password_hash": 0},
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/teacher/{reg_no}")
def get_teacher_by_id(reg_no: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can look up teachers")

    teacher = teachers_collection.find_one(
        {"registration_number": int(reg_no)},
        {"_id": 0, "password_hash": 0},
    )
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher
