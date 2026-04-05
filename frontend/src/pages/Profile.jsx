import { useState } from "react";
import api from "../api";

export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState("personal");

  if (!user) return <p>Loading...</p>;

  return (
    <div style={page}>

      {/* TITLE */}
      <h2 style={title}>My Profile</h2>

      <div style={layout}>

        {/* LEFT CARD */}
        <div style={leftCard}>
          <div style={avatar}>
            {user.name?.[0] || "U"}
          </div>

          <h3 style={name}>{user.name}</h3>
          <p style={email}>{user.email}</p>

          <span style={roleBadge}>
            {user.role || "User"}
          </span>
        </div>

        {/* RIGHT CARD */}
        <div style={rightCard}>

          {/* TABS */}
          <div style={tabs}>
            <div
              style={{
                ...tab,
                borderBottom: activeTab === "personal" ? "3px solid #6366f1" : "none",
                color: activeTab === "personal" ? "#6366f1" : "#6b7280"
              }}
              onClick={() => setActiveTab("personal")}
            >
              👤 Personal Details
            </div>

            
          </div>

          {/* CONTENT */}
          {activeTab === "personal" && (
            <div>

              <div style={sectionHeader}>
                <h3>Your Information</h3>
                
              </div>

              <div style={formGrid}>

                <Input label="Full Name" value={user.name} />
                <Input label="Department" value={user.department} />
                <Input label="Year" value={user.year} />
                <Input label="Phone" value={user.phone} />
                <Input label="Address" value={user.address} />

              </div>
            </div>
          )}

          
          

        </div>
      </div>
    </div>
  );
}

/* 🔥 REUSABLE INPUT */
function Input({ label, value }) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <div style={inputBox}>{value || "—"}</div>
    </div>
  );
}

//////////////////// STYLES ////////////////////

const page = {
  padding: "40px 70px",
  fontFamily: "Poppins, sans-serif",
  background: "#f3f6fb",
  minHeight: "100vh"
};

const title = {
  fontSize: "30px",
  fontWeight: "800",
  marginBottom: "25px",
  color: "#111827"
};

const layout = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap"
};

const leftCard = {
  flex: "1",
  minWidth: "280px",
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  textAlign: "center"
};

const avatar = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "#e0e7ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 auto 15px",
  color: "#4f46e5",
  border: "4px solid #6366f1"
};

const name = {
  fontSize: "20px",
  fontWeight: "700"
};

const email = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "10px"
};

const roleBadge = {
  background: "#eef2ff",
  color: "#4f46e5",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "12px"
};

const rightCard = {
  flex: "2",
  minWidth: "400px",
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  overflow: "hidden"
};

const tabs = {
  display: "flex",
  borderBottom: "1px solid #eee"
};

const tab = {
  padding: "15px 20px",
  cursor: "pointer",
  fontWeight: "600"
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px"
};

const editBtn = {
  background: "#e0e7ff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#4f46e5"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  padding: "20px"
};

const labelStyle = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "6px",
  fontWeight: "600"
};

const inputBox = {
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "10px",
  fontWeight: "500"
};