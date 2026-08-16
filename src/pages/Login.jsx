import React, { useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { signUpUser, signInUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, Baby, Users, BookOpen, GraduationCap } from "lucide-react";

const SelectionCard = ({ icon: Icon, title, subtitle, selected, onClick, accentColor }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      padding: "18px 12px", borderRadius: 15,
      border: selected ? `2px solid ${accentColor}` : "2px solid #262626",
      background: selected ? `${accentColor}15` : "#141414",
      cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
      boxShadow: selected ? `0 0 24px ${accentColor}35` : "none",
    }}
  >
    <div style={{ width: 44, height: 44, borderRadius: "50%", background: selected ? `${accentColor}22` : "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={20} color={selected ? accentColor : "#666"} />
    </div>
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: 600, fontSize: 13, color: selected ? "#fff" : "#999", margin: 0, letterSpacing: "-0.3px" }}>{title}</p>
      {subtitle && <p style={{ fontSize: 11, color: "#555", marginTop: 2, letterSpacing: "-0.1px" }}>{subtitle}</p>}
    </div>
    {selected && (
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    )}
  </button>
);

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalRole = ageGroup === "under14" ? "student" : role;

  const handleNext = (e) => { e.preventDefault(); setError(""); setStep(2); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !ageGroup) { setError("Please select your age group."); return; }
    setLoading(true); setError("");
    try {
      if (isSignUp) { await signUpUser(email, password, fullName, finalRole); }
      else          { await signInUser(email, password); }
      navigate("/");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const resetForm = (toSignUp) => {
    setIsSignUp(toSignUp); setStep(1);
    setEmail(""); setPassword(""); setFullName(""); setAgeGroup(""); setRole("student"); setError("");
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
      {/* Decorative glow blobs */}
      <div style={{ position: "absolute", top: 80, left: "25%", width: 320, height: 320, borderRadius: "50%", background: "rgba(106,76,245,0.12)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 60, right: "20%", width: 280, height: 280, borderRadius: "50%", background: "rgba(212,77,240,0.10)", filter: "blur(100px)", pointerEvents: "none" }} />

      <div className="animate-fade-up" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Card */}
        <div style={{ background: "#141414", border: "1px solid #262626", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
          {/* Accent top stripe */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#6a4cf5,#d44df0,#ff7a3d)" }} />

          <div style={{ padding: "36px 32px 32px" }}>
            {/* Logo mark */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6a4cf5,#d44df0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 16 }}>S</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", margin: 0 }}>
                {isSignUp ? (step === 1 ? "Create account" : "Who are you?") : "Sign in"}
              </h2>
              <p style={{ fontSize: 13, color: "#666", marginTop: 6, letterSpacing: "-0.1px" }}>
                {isSignUp ? step === 1 ? "Join SwarAstra today" : "Tell us about yourself" : "Welcome back to SwarAstra"}
              </p>
            </div>

            {/* Step dots */}
            {isSignUp && (
              <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
                {[1,2].map(s => (
                  <div key={s} style={{ height: 3, flex: 1, borderRadius: 100, background: step >= s ? "#6a4cf5" : "#262626", transition: "background 0.3s ease" }} />
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#f87171" }}>
                {error}
              </div>
            )}

            {/* ── Login ── */}
            {!isSignUp && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Role indicator tab */}
                <div style={{ display: "flex", background: "#1c1c1c", padding: 4, borderRadius: 12, border: "1px solid #262626", marginBottom: 4 }}>
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                      background: role === "student" ? "#6a4cf5" : "transparent",
                      color: role === "student" ? "#fff" : "#666",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <BookOpen size={14} /> Student / Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                      background: role === "teacher" ? "#d44df0" : "transparent",
                      color: role === "teacher" ? "#fff" : "#666",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <GraduationCap size={14} /> Teacher
                  </button>
                </div>

                <InputField icon={Mail} label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                <InputField icon={Lock} label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? `Signing in as ${role === "teacher" ? "Teacher" : "Student"}...` : `Sign in as ${role === "teacher" ? "Teacher" : "Student"}`}
                </button>
              </form>
            )}

            {/* ── Signup Step 1 ── */}
            {isSignUp && step === 1 && (
              <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <InputField icon={User} label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
                <InputField icon={Mail} label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                <InputField icon={Lock} label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
                  Next →
                </button>
              </form>
            )}

            {/* ── Signup Step 2 ── */}
            {isSignUp && step === 2 && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Your Age Group</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <SelectionCard icon={Baby} title="Under 14" subtitle="Young learner" selected={ageGroup === "under14"} onClick={() => { setAgeGroup("under14"); setRole("student"); }} accentColor="#6a4cf5" />
                    <SelectionCard icon={Users} title="Age 14+" subtitle="Teen or adult" selected={ageGroup === "14plus"} onClick={() => setAgeGroup("14plus")} accentColor="#ff7a3d" />
                  </div>
                </div>
                {ageGroup === "14plus" && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>I am a...</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <SelectionCard icon={BookOpen} title="Regular User" subtitle="Student / Learner" selected={role === "student"} onClick={() => setRole("student")} accentColor="#6a4cf5" />
                      <SelectionCard icon={GraduationCap} title="Teacher" subtitle="I teach students" selected={role === "teacher"} onClick={() => setRole("teacher")} accentColor="#d44df0" />
                    </div>
                  </div>
                )}
                {ageGroup && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#1c1c1c", border: "1px solid #262626" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                    <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Joining as <strong style={{ color: "#fff", textTransform: "capitalize" }}>{finalRole}</strong></p>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => { setStep(1); setError(""); }} className="btn-secondary" style={{ flex: 1 }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading || !ageGroup} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : "Create account"}
                  </button>
                </div>
              </form>
            )}

            {/* Switch mode */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#666", marginTop: 28 }}>
              {isSignUp ? "Already have an account?" : "No account yet?"}{" "}
              <button onClick={() => resetForm(!isSignUp)} style={{ color: "#0099ff", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13, letterSpacing: "-0.1px" }}>
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
