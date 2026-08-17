import React, { useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { signUpUser, signInUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, BookOpen, GraduationCap, ArrowLeft } from "lucide-react";

const InputField = ({ icon: Icon, label, type, value, onChange, placeholder, required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 500, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon size={16} color="#555" />
      </div>
      <input
        type={type} required={required} value={value} onChange={onChange} placeholder={placeholder}
        className="input-field"
        style={{ paddingLeft: 42, paddingRight: 14 }}
      />
    </div>
  </div>
);

const Login = () => {
  const { t } = useLocale();
  const navigate = useNavigate();

  // Screen steps: "ask_age" -> "ask_role" (if 14+) -> "auth_form"
  const [flowStep, setFlowStep] = useState("ask_age");
  const [ageGroup, setAgeGroup] = useState(""); // "under14" or "14plus"
  const [role, setRole] = useState("student");   // "student" or "teacher"
  const [isSignUp, setIsSignUp] = useState(false); // false = Sign in, true = Create account

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnder14 = () => {
    setAgeGroup("under14");
    setRole("student");
    setFlowStep("auth_form");
  };

  const handle14Plus = () => {
    setAgeGroup("14plus");
    setFlowStep("ask_role");
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFlowStep("auth_form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signUpUser(email, password, fullName, role);
      } else {
        await signInUser(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFlowStep("ask_age");
    setAgeGroup("");
    setRole("student");
    setError("");
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
      {/* Glow Orbs */}
      <div style={{ position: "absolute", top: 80, left: "25%", width: 340, height: 340, borderRadius: "50%", background: "rgba(106,76,245,0.12)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 60, right: "20%", width: 300, height: 300, borderRadius: "50%", background: "rgba(212,77,240,0.10)", filter: "blur(100px)", pointerEvents: "none" }} />

      {/* ── STEP 1: Age Check ("Are you 14 years old or older?") ────────────── */}
      {flowStep === "ask_age" && (
        <div className="animate-fade-up" style={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: 0,
              background: "linear-gradient(90deg, #d44df0 0%, #a78bfa 50%, #6a4cf5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 12,
            }}
          >
            SwarAstra
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 36, fontWeight: 400 }}>
            Are you 14 years old or older?
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handle14Plus}
              style={{
                padding: "14px 32px",
                borderRadius: 100,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                minWidth: 200,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.background = "#1c1c21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#141417";
              }}
            >
              I am 14 or older
            </button>

            <button
              onClick={handleUnder14}
              style={{
                padding: "14px 32px",
                borderRadius: 100,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                minWidth: 200,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#06b6d4";
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.background = "#1c1c21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#141417";
              }}
            >
              I am under 14
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Role Selection (For 14+) ────────────────────────────── */}
      {flowStep === "ask_role" && (
        <div className="animate-fade-up" style={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
          <button
            onClick={resetAll}
            style={{
              background: "none", border: "none", color: "#64748b", cursor: "pointer",
              fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
            }}
          >
            <ArrowLeft size={16} /> Back to age check
          </button>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: 0,
              background: "linear-gradient(90deg, #d44df0 0%, #a78bfa 50%, #6a4cf5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 10,
            }}
          >
            SwarAstra
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 36, fontWeight: 400 }}>
            How would you like to join?
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => handleRoleSelect("student")}
              style={{
                flex: "1 1 240px",
                maxWidth: 260,
                padding: "24px 20px",
                borderRadius: 20,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6a4cf5";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "#1c1c21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#141417";
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(106,76,245,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                <BookOpen size={24} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Regular User / Student</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Learn Gujarati signs, maths & science</span>
            </button>

            <button
              onClick={() => handleRoleSelect("teacher")}
              style={{
                flex: "1 1 240px",
                maxWidth: 260,
                padding: "24px 20px",
                borderRadius: 20,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d44df0";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "#1c1c21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#141417";
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(212,77,240,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e86af5" }}>
                <GraduationCap size={24} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Teacher</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Add questions & guide students</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Sign In / Create Account Interface ────────────────────── */}
      {flowStep === "auth_form" && (
        <div className="animate-fade-up" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
          <div style={{ background: "#141414", border: "1px solid #262626", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ height: 3, background: role === "teacher" ? "linear-gradient(90deg,#d44df0,#e86af5)" : "linear-gradient(90deg,#6a4cf5,#d44df0,#ff7a3d)" }} />

            <div style={{ padding: "32px 28px 28px" }}>
              {/* Back button */}
              <button
                type="button"
                onClick={() => setFlowStep(ageGroup === "under14" ? "ask_age" : "ask_role")}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}
              >
                <ArrowLeft size={14} /> Change options
              </button>

              {/* Logo + Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#6a4cf5,#d44df0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>S</div>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, background: role === "teacher" ? "rgba(212,77,240,0.15)" : "rgba(106,76,245,0.15)", color: role === "teacher" ? "#e86af5" : "#a78bfa", border: `1px solid ${role === "teacher" ? "rgba(212,77,240,0.3)" : "rgba(106,76,245,0.3)"}`, textTransform: "capitalize", fontWeight: 600 }}>
                    {role} • {ageGroup === "under14" ? "Under 14" : "14+"}
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", marginTop: 14, marginBotton: 4 }}>
                  {isSignUp ? `Create ${role === "teacher" ? "Teacher" : "Student"} Account` : `Sign In as ${role === "teacher" ? "Teacher" : "Student"}`}
                </h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                  {isSignUp ? "Enter your details to register" : "Enter your email & password to continue"}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {isSignUp && (
                  <InputField icon={User} label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
                )}
                <InputField icon={Mail} label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                <InputField icon={Lock} label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading
                    ? (isSignUp ? "Creating account..." : "Signing in...")
                    : (isSignUp ? "Create Account" : "Sign In")}
                </button>
              </form>

              {/* Mode switch (Sign in <-> Create account) */}
              <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 24, marginBottom: 0 }}>
                {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  style={{ color: "#0099ff", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
