from app.db.mongo import db
# def find_user_by_reg_no(reg_no: int):
#     user = db["students"].find_one({"registration_number": reg_no})
#     if user:
#         user["role"] = "STUDENT"
#         return user
#     user = db["teachers"].find_one({"registration_number": reg_no})
#     if user:
#         user["role"] = "TEACHER"
#         return user
#     user = db["admins"].find_one({"registration_number": reg_no})
#     if user:
#         user["role"] = "ADMIN"
#         return user
#     return None
def find_user_by_reg_no(reg_no):
    reg_no = str(reg_no)

    # check students
    students = list(db["students"].find({}, {"_id": 0}))
    for user in students:
        if str(user["registration_number"]) == reg_no:
            user["role"] = "STUDENT"
            return user

    # check teachers
    teachers = list(db["teachers"].find({}, {"_id": 0}))
    for user in teachers:
        if str(user["registration_number"]) == reg_no:
            user["role"] = "TEACHER"
            return user

    # check admins
    admins = list(db["admins"].find({}, {"_id": 0}))
    for user in admins:
        if str(user["registration_number"]) == reg_no:
            user["role"] = "ADMIN"
            return user

    return None