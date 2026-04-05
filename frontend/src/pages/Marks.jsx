import { useState, useEffect } from "react";
import api from "../api";

export default function Marks({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.role === "STUDENT") {
      api.get("/me").then(r => setProfile(r.data)).catch(console.error);
    }
  }, [user]);

  if (!user) return <p style={{ padding: 20 }}>Loading...</p>;

  if (user.role === "STUDENT") {
    const marks = profile?.marks || {};

    return (
      <div style={wrap}>
        <h2 style={title}>My Marks</h2>

        {Object.keys(marks).length === 0
          ? <p style={empty}>No marks available</p>
          : <div style={grid}>
              {Object.entries(marks).map(([sub, val]) => (
                <div key={sub} style={card}>

                  {/* SUBJECT */}
                  <div style={topRow}>
                    <span style={subject}>{sub}</span>
                    <span style={grade(val)}>Grade {gradeLabel(val)}</span>
                  </div>

                  {/* SCORE */}
                  <h1 style={score}>
                    {val}<span style={outOf}>/100</span>
                  </h1>

                  {/* PROGRESS */}
                  <div style={bar}>
                    <div
                      style={{
                        ...barFill,
                        width: `${val}%`,
                        background:
                          val >= 75 ? "#22c55e" :
                          val >= 50 ? "#6366f1" :
                          "#ef4444"
                      }}
                    />
                  </div>

                </div>
              ))}
            </div>
        }
      </div>
    );
  }

  return <ModifyMarksView />;
}

//////////////// UI STYLES //////////////////

const wrap = {
  padding: "40px 70px",
  background: "#f3f6fb",
  minHeight: "100vh",
  fontFamily: "Poppins, sans-serif"
};

const title = {
  fontSize: "28px",
  fontWeight: "800",
  marginBottom: "20px"
};

const empty = {
  color: "#6b7280"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  transition: "0.3s"
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px"
};

const subject = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#4f46e5",
  background: "#e0e7ff",
  padding: "4px 10px",
  borderRadius: "12px"
};

const grade = (val) => ({
  fontSize: "12px",
  fontWeight: "600",
  color:
    val >= 75 ? "#16a34a" :
    val >= 50 ? "#4f46e5" :
    "#dc2626"
});

const score = {
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "12px"
};

const outOf = {
  fontSize: "14px",
  color: "#6b7280",
  marginLeft: "4px"
};

const bar = {
  height: "8px",
  background: "#e5e7eb",
  borderRadius: "10px"
};

const barFill = {
  height: "100%",
  borderRadius: "10px",
  transition: "0.4s"
};

//////////////// LOGIC (UNCHANGED) //////////////////

const gradeLabel = m =>
  m >= 90 ? "O" :
  m >= 75 ? "A" :
  m >= 60 ? "B" :
  m >= 50 ? "C" : "F";