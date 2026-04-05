import { useState, useEffect } from "react";
import api from "../api";

export default function Dashboard({ user, setUser }) {
  const [searchReg, setSearchReg] = useState("");
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/student/${searchReg}`);
      setSearchedStudent(res.data);
    } catch (err) {
      console.error("Student not found", err);
    }
  };

  if (loading) return (
    <div style={{ ...page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ color: "#6366f1", fontWeight: 600, fontSize: "18px" }}>
        Loading Secure Data...
      </div>
    </div>
  );

  return (
    <div style={page}>

      {/* HEADER */}
      <div style={headerBox}>
        <h2 style={headerTitle}>Dashboard</h2>
        <p style={subText}>{user.role} Control Panel</p>
      </div>

      {/* PROFILE */}
      {profile && (
        <>
          <h3 style={sectionLabel}>My Profile</h3>

          <div
            style={card}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}
          >
            <div style={profileGrid}>
              <InfoField label="Name" value={profile.name} />
              <InfoField label="Registration No" value={profile.registration_number} />
              <InfoField label="Department" value={profile.department} />

              {user.role === "STUDENT" && (
                <>
                  <InfoField label="Year" value={profile.year} />
                  <InfoField label="Date of Birth" value={profile.dob} />
                  <InfoField label="Address" value={profile.address} />
                </>
              )}

              <InfoField label="Phone" value={profile.phone} />
              <InfoField label="System Role" value={profile.role} highlight />
            </div>
          </div>
        </>
      )}

      {/* SEARCH */}
      {(user.role === "TEACHER" || user.role === "ADMIN") && (
        <>
          <h3 style={sectionLabel}>Student Audit Lookup</h3>

          <div style={searchContainer}>
            <input
              placeholder="Enter Registration Number..."
              value={searchReg}
              onChange={(e) => setSearchReg(e.target.value)}
              style={input}
            />

            <button style={btn} onClick={fetchStudent}>
              Verify Student
            </button>
          </div>

          {searchedStudent && (
            <div style={{ marginTop: "25px" }}>
              <h3 style={sectionLabel}>Verification Result</h3>
              <StudentCard student={searchedStudent} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InfoField({ label, value, highlight }) {
  return (
    <div>
      <p style={fieldLabel}>{label}</p>
      <p style={{ ...fieldValue, color: highlight ? "#010100" : "#0f172a" }}>
        {value || "—"}
      </p>
    </div>
  );
}

function StudentCard({ student }) {
  return (
    <div style={card}>
      <div style={profileGrid}>
        <InfoField label="Full Name" value={student.name} />
        <InfoField label="Registration No" value={student.registration_number} />
        <InfoField label="Department" value={student.department} />
        <InfoField label="Year" value={student.year} />
        <InfoField label="Date of Birth" value={student.dob} />
        <InfoField label="Gender" value={student.gender} />
        <InfoField label="Contact" value={student.phone} />
        <InfoField label="Location" value={student.address} />
      </div>
    </div>
  );
}

//////////////////// UI STYLES ////////////////////
const page = {
  padding: "60px 80px",
  minHeight: "100vh",
  fontFamily: "Poppins, sans-serif",

  background: `
    linear-gradient(rgba(99,102,241,0.08), rgba(99,102,241,0.08)),
    url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const headerBox = {
  marginBottom: "30px"
};

const headerTitle = {
  fontSize: "42px",
  fontWeight: "900",
  color: "#111827", // 🔥 solid black
  letterSpacing: "-0.5px",
};

const subText = {
  fontSize: "20px",
  fontWeight: "800",
  color: "#e1ebec"
  
};

const sectionLabel = {
  fontSize: "25px",
  fontWeight: "100",
  color: "#000002",
  marginTop: "40px",
  marginBottom: "15px",
  letterSpacing: "1px",
  fontWeight: "600"
};

const card = {
  padding: "30px",
  borderRadius: "18px",

  background: "rgba(255, 255, 255, 0.65)", // 👈 transparent
  backdropFilter: "blur(12px)",           // 👈 glass effect
  WebkitBackdropFilter: "blur(12px)",

  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",

  maxWidth: "1100px",
};

const profileGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "28px",
};

const fieldLabel = {
  fontSize: "13px",
  color: "#6b7280",
  fontWeight: "500",
}
;
const fieldValue = {
  fontSize: "17px",
  fontWeight: "700", // 🔥 bold
  color: "#111827",
};

const searchContainer = {
  display: "flex",
  gap: 15,
  maxWidth: "700px",
};

const input = {
  padding: "14px",
  flex: 1,
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#000308",
};

const btn = {
  padding: "13px 26px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
}
;
const subtitle = {
  fontSize: "15px",
  color: "#6b7280", // soft grey
  fontWeight: "500",
  marginTop: "6px",
};
const sectionTitle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#000000",
  marginBottom: "15px",
}
;