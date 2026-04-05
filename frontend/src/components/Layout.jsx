import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  User,
  BarChart3,
  Calendar,
  FileText,
  Pencil,
  CheckCircle,
  Users,
  ClipboardList,
  Search,
  LogOut
} from "lucide-react";

export default function Layout({ children, setUser, user }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const profileRef = useRef();

  const isStudent = user?.role === "STUDENT";
  const isTeacher = user?.role === "TEACHER";
  const isAdmin   = user?.role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FIXED ICON RENDER
  const navItem = (path, label, Icon) => {
    const isActive = location.pathname === path;

    return (
      <Link to={path} style={linkStyle}>
        <div
          style={{
            ...navBtn,
            color: isActive ? "#4f8cff" : "#444",
            borderBottom: isActive ? "2px solid #4f8cff" : "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#4f8cff";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.color = "#444";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Icon size={18} />   {/* 🔥 REAL ICON */}
          {label}
        </div>
      </Link>
    );
  };

  return (
    <div style={container}>

      <div style={navbar}>
        <div style={logo}>🎓 Secure Academic</div>

        <div style={navLinks}>
          {navItem("/dashboard", "Dashboard", LayoutDashboard)}

          {isStudent && (
            <>
              
              {navItem("/marks", "Marks", BarChart3)}
              {navItem("/attendance", "Attendance", Calendar)}
              {navItem("/assignments", "Assignments", FileText)}
              {navItem("/profile", "Profile", User)}
            </>
          )}

          {isTeacher && (
            <>
              {navItem("/modify-marks", "Modify", Pencil)}
              {navItem("/attendance", "Attendance", Calendar)}
              {navItem("/logs", "Logs", ClipboardList)}
              {navItem("/verify", "Verify", Search)}
            </>
          )}

          {isAdmin && (
            <>
              {navItem("/modify-marks", "Modify", Pencil)}
              {navItem("/attendance", "Attendance", Calendar)}
              {navItem("/approve", "Approve", CheckCircle)}
              {navItem("/admin", "Users", Users)}
              {navItem("/logs", "Logs", ClipboardList)}
              {navItem("/verify", "Verify", Search)}
            </>
          )}
        </div>

        <div style={profileWrapper} ref={profileRef}>
          <div style={avatar} onClick={() => setOpen(!open)}>
            {user?.name?.[0] || "U"}
          </div>

          {open && (
            <div style={dropdown}>
              <p style={{ margin: 0, fontWeight: 600 }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: "#777" }}>{user?.email}</p>

              <hr />

              <Link to="/profile" style={dropItem}>👤 My Profile</Link>

              <div
                style={{ ...dropItem, color: "red", display: "flex", gap: "6px", alignItems: "center" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  setUser(null);
                }}
              >
                <LogOut size={16} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={main}>{children}</div>

      <div style={footer}>
        <div style={footerBottom}>
          © 2026 BlockAudit System. Made with secure audit blockchain technology.<br />
          Designed for educational institutions to ensure compliance and transparency.
        </div>
      </div>

    </div>
  );
}

//////////////////// STYLES ////////////////////

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "#f5f7fb",
  fontFamily: "'Poppins', sans-serif"
};

const navbar = {
  height: "75px",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 50px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  position: "sticky",
  top: 0,
  zIndex: 100
};

const logo = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#4f8cff"
};

const navLinks = {
  display: "flex",
  gap: "45px",
  alignItems: "center"
};

const navBtn = {
  fontSize: "17px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.25s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const linkStyle = {
  textDecoration: "none"
};

const profileWrapper = {
  position: "relative"
};

const avatar = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "#4f8cff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "18px"
};

const dropdown = {
  position: "absolute",
  top: "60px",
  right: 0,
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
};

const dropItem = {
  display: "block",
  padding: "10px 0",
  cursor: "pointer",
  fontSize: "14px",
  textDecoration: "none",
  color: "#333"
};

const main = {
  flex: 1,
  padding: "40px"
};

const footer = {
  padding: "25px",
  background: "#0f172a",
  color: "#ccc",
  textAlign: "center"
};

const footerBottom = {
  fontSize: "14px",
  lineHeight: "1.7"
};