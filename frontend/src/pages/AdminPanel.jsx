import { useState } from "react";
import api from "../api";

const ROLES = ["STUDENT", "TEACHER", "ADMIN"];

const defaultForm = {
  registration_number: "",
  name: "",
  password: "",
  role: "STUDENT",
  department: "",
  year: "",
  phone: "",
  address: "",
  dob: "",
  gender: "",
};

export default function AdminPanel({ user }) {
  const [form, setForm]     = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user?.role !== "ADMIN") {
    return <div style={{ padding: 24, color: "#e53935" }}>⛔ Access denied. Admins only.</div>;
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.registration_number || !form.name || !form.password || !form.role) {
      setResult({ status: "ERROR", message: "Registration number, name, password and role are required." });
      return;
    }
    setLoading(true); setResult(null);
    try {
      const res = await api.post("/add-user", {
        ...form,
        registration_number: Number(form.registration_number),
        year: form.year ? Number(form.year) : undefined,
      });
      setResult(res.data);
      if (res.data.status === "SUCCESS") setForm(defaultForm);
    } catch (err) {
      setResult({ status: "ERROR", message: err?.response?.data?.detail || "Failed to add user." });
    }
    setLoading(false);
  };

  const isStudent = form.role === "STUDENT";

  return (
    <div style={wrap}>
      <h2 style={{
  fontSize: "32px",
  fontWeight: "700",
  color: "#111",
  marginBottom: 6,
  textAlign: "center"
}}>
  Add New User
</h2>
      <p style={sub}>Only admins can create new students, teachers, or admins.</p>

      <div style={formCard}>
        {/* Role selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {ROLES.map(r => (
            <button key={r} style={{ ...roleBtn, ...(form.role === r ? roleBtnActive : {}) }}
              onClick={() => set("role", r)}>{r}</button>
          ))}
        </div>

        <Row label="Registration Number *">
          <input style={inputStyle} type="number" placeholder="e.g. 20210051"
            value={form.registration_number} onChange={e => set("registration_number", e.target.value)} />
        </Row>

        <Row label="Full Name *">
          <input style={inputStyle} placeholder="e.g. John Doe"
            value={form.name} onChange={e => set("name", e.target.value)} />
        </Row>

        <Row label="Password *">
          <input style={inputStyle} type="password" placeholder="Set a password"
            value={form.password} onChange={e => set("password", e.target.value)} />
        </Row>

        <Row label="Department">
          <input style={inputStyle} placeholder="e.g. CSE"
            value={form.department} onChange={e => set("department", e.target.value)} />
        </Row>

        {isStudent && (
          <>
            <Row label="Year">
              <input style={inputStyle} type="number" min={1} max={4} placeholder="1–4"
                value={form.year} onChange={e => set("year", e.target.value)} />
            </Row>
            <Row label="Date of Birth">
              <input style={inputStyle} type="date"
                value={form.dob} onChange={e => set("dob", e.target.value)} />
            </Row>
            <Row label="Gender">
              <select style={inputStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Row>
            <Row label="Phone">
              <input style={inputStyle} placeholder="e.g. 9000000000"
                value={form.phone} onChange={e => set("phone", e.target.value)} />
            </Row>
            <Row label="Address">
              <input style={inputStyle} placeholder="e.g. Chennai, Tamil Nadu"
                value={form.address} onChange={e => set("address", e.target.value)} />
            </Row>
          </>
        )}

        <button style={{ ...btn, opacity: loading ? 0.7 : 1, marginTop: 8 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : `➕ Add ${form.role}`}
        </button>

        {result && (
          <div style={resultBox(result.status)}>
            <p style={{ color: resultColor(result.status), margin: 0, fontWeight: 600, fontSize: 13 }}>
              {result.status}
            </p>
            <p style={{ color: "#ccc", margin: "4px 0 0", fontSize: 13 }}>{result.message}</p>
          </div>
        )}
      </div>

      <div style={ruleNote}>
        <span style={{ color: "#e53935", fontSize: 12 }}> ADMIN ONLY</span>
        <span style={{ color: "#666", fontSize: 12, marginLeft: 8 }}>
        </span>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
const wrap = {
  padding: "50px 70px",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "linear-gradient(120deg,#f8fafc,#e0f2fe)",
};

const sub = {
  color: "#64748b",
  fontSize: 14,
  marginBottom: 24,
  textAlign: "center",
};

const formCard = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(16px)",
  padding: 28,
  borderRadius: 18,
  maxWidth: 520,
  width: "100%",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const labelStyle = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 6,
  display: "block",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#111",
  fontSize: 14,
};

const btn = {
  width: "100%",
  padding: 13,
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#16a34a)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 15,
};

const roleBtn = {
  flex: 1,
  padding: "10px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#64748b",
  cursor: "pointer",
  fontWeight: 600,
};

const roleBtnActive = {
  background: "#22c55e",
  color: "white",
  border: "1px solid #22c55e",
};

const ruleNote = {
  marginTop: 20,
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid #fecaca",
  background: "#fff5f5",
  maxWidth: 520,
  width: "100%",
  textAlign: "center",
};