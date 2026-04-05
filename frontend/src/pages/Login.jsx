import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [regNo, setRegNo]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!regNo || !password) {
      setError("Enter both fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/login", {
        registration_number: regNo.toString(),
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      const me = await api.get("/me");
      setUser(me.data);
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    
    <div style={page}>
       <style>
      {`
      @keyframes fadeIn {
        from { opacity: 0 }
        to { opacity: 1 }
      }
      @keyframes slideLeft {
        from { transform: translateX(-40px); opacity: 0 }
        to { transform: translateX(0); opacity: 1 }
      }
      @keyframes slideRight {
        from { transform: translateX(40px); opacity: 0 }
        to { transform: translateX(0); opacity: 1 }
      }
      `}
    </style>

      {/* LEFT SIDE */}
      <div style={left}>
        <h1 style={brand}>BlockAudit</h1>
        <p style={tagline}>
          Secure academic systems powered by blockchain.
        </p>

        <div style={featureBox}>
          <p>🔐 Tamper-proof data</p>
          <p>⚡ Real-time audit logs</p>
          <p>📊 Transparent system</p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div style={right}>

        <button 
        style={backBtn} 
        onClick={() => navigate("/")}
        onMouseEnter={(e) => {
  e.target.style.background = "#22c55e";
  e.target.style.color = "white";
}}
onMouseLeave={(e) => {
  e.target.style.background = "#ffffff";
  e.target.style.color = "black";
}}
>
          ← Back
        </button>

        <div style={formBox}>

          <h2 style={title}>Welcome Back</h2>
          <p style={subtitle}>Login to your account</p>

          {error && <div style={errorBox}>{error}</div>}

          <input
            style={input}
            placeholder="Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            onKeyDown={handleKey}
             onFocus={(e) => {
    e.target.style.border = "1px solid #22c55e";
    e.target.style.boxShadow = "0 0 0 4px rgba(34,197,94,0.2)";
    e.target.style.background = "#fff";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #e5e7eb";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#f9fafb";
  }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              style={input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
              onFocus={(e) => {
    e.target.style.border = "1px solid #22c55e";
    e.target.style.boxShadow = "0 0 0 4px rgba(34,197,94,0.2)";
    e.target.style.background = "#fff";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #e5e7eb";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#f9fafb";
  }}
            />
            <span
              style={eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️‍🗨️" : "👁"}
            </span>
          </div>

          <button
            style={btn}
            onClick={handleLogin}
            disabled={loading}
             onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-3px) scale(1.03)";
    e.target.style.boxShadow = "0 15px 30px rgba(0,0,0,0.2)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "none";
    e.target.style.boxShadow = "none";
  }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={featureRow}>

  <div style={featureCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#22c55e";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.transform = "translateY(-3px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#f1f5f9";
    e.currentTarget.style.color = "black";
    e.currentTarget.style.transform = "none";
  }}
  >
    🔐 Secure Data
  </div>

  <div style={featureCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#22c55e";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.transform = "translateY(-3px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#f1f5f9";
    e.currentTarget.style.color = "black";
    e.currentTarget.style.transform = "none";
  }}>
    ⚡ Fast Audit
  </div>

  <div style={featureCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#22c55e";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.transform = "translateY(-3px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#f1f5f9";
    e.currentTarget.style.color = "black";
    e.currentTarget.style.transform = "none";
  }}>
    📊 Transparent
  </div>

</div>

        </div>

        <div style={footer}>
          © 2026 BlockAudit
        </div>

      </div>
    </div>
  );
}

/* MAIN LAYOUT */
const page = {
  display: "flex",
  height: "100vh",
  fontFamily: "Poppins, sans-serif",
  animation: "fadeIn 0.6s ease",
};

/* LEFT */
const left = {
  flex: 1,

  /* 🔥 IMAGE BACKGROUND */
  background: `
    linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)),
    url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",

  color: "white",
  padding: "60px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  animation: "slideLeft 0.7s ease",
};

const brand = {
  fontSize: "48px",
  fontWeight: "800",
};
const tagline = {
  marginTop: 10,
  color: "#e2e8f0",
  fontSize: 16,
};

const featureBox = {
  marginTop: 30,
  lineHeight: 2,
  color: "#f1f5f9",
  fontSize: 15,
};

/* RIGHT */
const right = {
  flex: 1,
  background: "radial-gradient(circle at top,#e0f2fe,#f8fafc)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  animation: "slideRight 0.7s ease",
};

/* FORM */
const formBox = {
  width: 340,
  padding: "40px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
};

const title = {
  fontSize: 24,
  marginBottom: 6,
};

const subtitle = {
  fontSize: 13,
  color: "#666",
  marginBottom: 20,
};

/* INPUT */
const input = {
  width: "100%",
  padding: "13px",
  marginBottom: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  transition: "all 0.25s ease",
};

/* BUTTON */
const btn = {
  width: "100%",
  padding: "13px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#06b6d4)",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
};

/* ERROR */
const errorBox = {
  background: "#fee2e2",
  padding: 10,
  borderRadius: 6,
  marginBottom: 10,
};

/* EYE */
const eye = {
  position: "absolute",
  right: 12,
  top: 12,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

/* BACK */
const backBtn = {
  position: "absolute",
  top: 20,
  left: 20,
  padding: "8px 18px",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: 500,
  transition: "all 0.25s ease",
};
/* FOOTER */
const footer = {
  position: "absolute",
  bottom: 15,
  fontSize: 12,
  color: "#64748b",
  textAlign: "center",
};
const featureRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 20,
  gap: 10,
};
const featureCard = {
  flex: 1,
  padding: "10px",
  borderRadius: 10,
  background: "#f1f5f9",
  fontSize: 12,
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.25s ease",
};