import { useState } from "react";
import api from "../api";

const DEMO_ASSIGNMENTS = [
  { id: "A001", title: "Data Structures Lab Report", course: "CSE401", due: "2025-04-10", description: "Submit a report on AVL tree implementation." },
  { id: "A002", title: "DBMS Mini Project", course: "CSE402", due: "2025-04-15", description: "Design and implement a database for a library system." },
  { id: "A003", title: "OS Process Scheduling", course: "CSE403", due: "2025-04-20", description: "Simulate FCFS, SJF, and Round Robin scheduling algorithms." },
  { id: "A004", title: "CN Socket Programming", course: "CSE404", due: "2025-04-25", description: "Implement a TCP client-server chat application." },
];

export default function Assignments({ user }) {
  if (user?.role === "STUDENT") return <StudentAssignments />;
  return <TeacherAssignments />;
}

function StudentAssignments() {
  const [submitted, setSubmitted] = useState({});

  const handleSubmit = (id) => {
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    alert(`Assignment ${id} submitted!`);
  };

  return (
    <div style={wrap}>
      <h2 style={title}>Assignments</h2>
      <p style={sub}>View and submit your assignments before the due date.</p>

      <div style={grid}>
        {DEMO_ASSIGNMENTS.map((a) => {
          const done = !!submitted[a.id];
          const overdue = new Date(a.due) < new Date();

          return (
            <div key={a.id} style={card}>

              {/* TOP */}
              <div style={topRow}>
                <span style={coursePill}>{a.course}</span>
                <span style={statusBadge(done, overdue)}>
                  {done ? "Submitted" : overdue ? "Overdue" : "Pending"}
                </span>
              </div>

              {/* TITLE */}
              <h3 style={cardTitle}>{a.title}</h3>
              <p style={desc}>{a.description}</p>

              {/* DUE */}
              <p style={due(overdue, done)}>Due: {a.due}</p>

              {/* PROGRESS */}
              <div style={progressBar}>
                <div style={progressFill(done)} />
              </div>

              {/* ACTION */}
              <div style={bottomRow}>
                {!done ? (
                  <button style={submitBtn} onClick={() => handleSubmit(a.id)}>
                    Submit
                  </button>
                ) : (
                  <span style={doneText}>✔ Submitted</span>
                )}
                <span style={view}>View Details</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

//////////////////// STYLES ////////////////////

const wrap = {
  padding: "40px 70px",
  background: "#f3f6fb",
  minHeight: "100vh",
  fontFamily: "Poppins, sans-serif"
};

const title = {
  fontSize: "28px",
  fontWeight: "800",
  marginBottom: "6px"
};

const sub = {
  color: "#6b7280",
  marginBottom: "25px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  transition: "0.3s"
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px"
};

const coursePill = {
  background: "#e0f2fe",
  color: "#0284c7",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600"
};

const statusBadge = (done, overdue) => ({
  background: done ? "#dcfce7" : overdue ? "#fee2e2" : "#e0e7ff",
  color: done ? "#16a34a" : overdue ? "#dc2626" : "#4f46e5",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600"
});

const cardTitle = {
  fontSize: "16px",
  fontWeight: "700",
  marginBottom: "6px"
};

const desc = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "10px"
};

const due = (overdue, done) => ({
  fontSize: "12px",
  color: overdue && !done ? "#dc2626" : "#6b7280",
  marginBottom: "10px"
});

const progressBar = {
  height: "6px",
  background: "#e5e7eb",
  borderRadius: "10px",
  marginBottom: "12px"
};

const progressFill = (done) => ({
  width: done ? "100%" : "60%",
  height: "100%",
  background: done ? "#22c55e" : "#6366f1",
  borderRadius: "10px"
});

const bottomRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const submitBtn = {
  background: "#22c55e",
  border: "none",
  padding: "6px 14px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "600"
};

const doneText = {
  color: "#16a34a",
  fontWeight: "600"
};

const view = {
  color: "#4f46e5",
  fontSize: "13px",
  cursor: "pointer"
};