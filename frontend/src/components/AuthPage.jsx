import { useState } from "react";
import { login, register } from "../services/api";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ email: "", password: "", line_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError("กรุณากรอกให้ครบ");
    setLoading(true);
    setError("");
    try {
      const data = mode === "login"
        ? await login(form.email, form.password)
        : await register(form.email, form.password, form.line_id);

      if (data.access_token) {
        onAuth();
      } else {
        setError(data.detail || "เกิดข้อผิดพลาด");
      }
    } catch {
      setError("เชื่อมต่อ backend ไม่ได้ — ตรวจสอบว่า backend รันอยู่");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#202124" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: "#2d2e30", border: "1px solid #3c3f43" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="text-3xl">🤖</span>
          <span className="text-xl font-medium" style={{ color: "#e8eaed" }}>AI Todo</span>
        </div>

        {/* Tab */}
        <div className="flex mb-6 rounded-full p-1" style={{ backgroundColor: "#3c3f43" }}>
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className="flex-1 py-1.5 text-sm font-medium rounded-full transition"
              style={{
                backgroundColor: mode === m ? "#fdd663" : "transparent",
                color: mode === m ? "#202124" : "#9aa0a6",
              }}
            >
              {m === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="อีเมล"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "#3c3f43", color: "#e8eaed", border: "1px solid #5f6368" }}
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="รหัสผ่าน"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "#3c3f43", color: "#e8eaed", border: "1px solid #5f6368" }}
          />

          {mode === "register" && (
            <div>
              <input
                name="line_id"
                value={form.line_id}
                onChange={handleChange}
                placeholder="LINE User ID (ไม่บังคับ — สำหรับรับแจ้งเตือน)"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ backgroundColor: "#3c3f43", color: "#e8eaed", border: "1px solid #5f6368" }}
              />
              <p className="text-xs mt-1 px-1" style={{ color: "#9aa0a6" }}>
                หา User ID ได้จาก LINE Bot ของคุณ
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-center" style={{ color: "#f28b82" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 mt-1 rounded-xl text-sm font-medium transition"
            style={{
              backgroundColor: "#fdd663",
              color: "#202124",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "⏳ กำลังดำเนินการ..." : mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </div>
      </div>
    </div>
  );
}
