import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);

  return (
    <div style={page}>

      {/* NAVBAR */}
      <div style={nav}>
        <div style={logoBox}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2091/2091665.png"
            style={{ height: 36 }}
          />
          <h2 style={brand}>BlockAudit</h2>
        </div>

        <button style={loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      {/* HERO */}
      <div style={hero}>
        <div style={{
          ...heroContent,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(40px)"
        }}>
          <h1 style={title}>
            Building Secure <br />
            <span style={{ color: "#4f46e5" }}>Blockchain Systems</span>
          </h1>

          <p style={subtitle}>
            Transparent, tamper-proof academic compliance with audit tracking and real-time verification.
          </p>

          <button style={cta} onClick={() => navigate("/login")}>
            Get Started →
          </button>
        </div>
      </div>

      {/* FEATURES — CLEAN STREET STYLE */}
      <div style={features}>

        <FeatureCard
          icon="📍"
          title="Precise Tracking"
          text="Accurate academic data monitoring with secure blockchain storage."
        />

        <FeatureCard
          icon="👥"
          title="Role-Based Access"
          text="Students, teachers, and admins with controlled permissions."
        />

        <FeatureCard
          icon="📊"
          title="Audit Transparency"
          text="Every update is logged and verified for complete trust."
        />

      </div>

      {/* FOOTER */}
      <div style={footer}>
        <div style={footerTop}>

          <div>
            <h3>BlockAudit</h3>
            <p style={{ color: "#6b7280", maxWidth: 300 }}>
              Secure blockchain-powered academic system ensuring transparency and compliance.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p style={link}>Login</p>
            <p style={link}>Dashboard</p>
            <p style={link}>Audit Logs</p>
          </div>

        </div>

        <div style={footerBottom}>
          © 2026 BlockAudit System. Built with secure blockchain technology.
        </div>
      </div>

    </div>
  );
}

/* 🔥 FEATURE CARD COMPONENT */
function FeatureCard({ icon, title, text }) {
  return (
    <div
      style={card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
      }}
    >
      <div style={iconCircle}>{icon}</div>
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "#6b7280", fontSize: 14 }}>{text}</p>
    </div>
  );
}

//////////////////// STYLES ////////////////////

const page = {
  fontFamily: "Poppins, sans-serif",
  background: "#f3f6fb",
};

/* NAVBAR */
const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 60px",
  background: "white",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const logoBox = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const brand = {
  margin: 0,
  fontWeight: 700,
  color: "#1e293b",
};

const loginBtn = {
  padding: "10px 18px",
  background: "#4f46e5",
  border: "none",
  borderRadius: 10,
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
};

/* HERO */
const hero = {
  height: "80vh",
  background:
    "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const heroContent = {
  textAlign: "center",
  color: "white",
};

const title = {
  fontSize: "52px",
  fontWeight: "800",
  marginBottom: 16,
};

const subtitle = {
  fontSize: "18px",
  marginBottom: 24,
  opacity: 0.9,
};

const cta = {
  padding: "14px 28px",
  background: "#4f46e5",
  border: "none",
  borderRadius: 12,
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

/* FEATURES */
const features = {
  display: "flex",
  justifyContent: "center",
  gap: 30,
  padding: "80px 20px",
  flexWrap: "wrap",
};

const card = {
  width: 280,
  padding: 28,
  borderRadius: 18,
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  textAlign: "center",
  transition: "0.3s",
};

const iconCircle = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "#e0e7ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
  fontSize: 24,
};

/* FOOTER */
const footer = {
  background: "#0f172a",
  color: "white",
  padding: "60px 80px",
};

const footerTop = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 40,
};

const link = {
  color: "#9ca3af",
  margin: "8px 0",
  cursor: "pointer",
};

const footerBottom = {
  marginTop: 40,
  textAlign: "center",
  color: "#9ca3af",
  fontSize: 13,
};