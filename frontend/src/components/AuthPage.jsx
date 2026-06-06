import { useState } from "react";
import { login, register } from "../services/api";

const LINE_BOT_ID = import.meta.env.VITE_LINE_BOT_ID || "";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", line_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLineGuide, setShowLineGuide] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center py-8" style={{ backgroundColor: "#202124" }}>
      <div className="w-full max-w-sm">

        {/* Card หลัก */}
        <div className="rounded-2xl p-8 shadow-2xl mb-3" style={{ backgroundColor: "#2d2e30", border: "1px solid #3c3f43" }}>

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
                onClick={() => { setMode(m); setError(""); setShowLineGuide(false); }}
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
              <div className="flex flex-col gap-2">
                <input
                  name="line_id"
                  value={form.line_id}
                  onChange={handleChange}
                  placeholder="LINE User ID (ไม่บังคับ)"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#3c3f43", color: "#e8eaed", border: "1px solid #5f6368" }}
                />
                <button
                  type="button"
                  onClick={() => setShowLineGuide(!showLineGuide)}
                  className="text-xs text-left px-1 transition"
                  style={{ color: "#8ab4f8" }}
                >
                  {showLineGuide ? "▲ ซ่อนวิธีหา LINE User ID" : "▼ วิธีเชื่อมต่อ LINE เพื่อรับแจ้งเตือน"}
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-center" style={{ color: "#f28b82" }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 mt-1 rounded-xl text-sm font-medium transition"
              style={{ backgroundColor: "#fdd663", color: "#202124", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "กำลังดำเนินการ..." : mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            </button>
          </div>
        </div>

        {/* LINE Guide Card */}
        {showLineGuide && (
          <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: "#2d2e30", border: "1px solid #06c755" }}>
            <p className="text-sm font-medium mb-4" style={{ color: "#06c755" }}>
              วิธีเชื่อมต่อ LINE
            </p>

            {/* Step 1 */}
            <div className="flex gap-3 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: "#06c755", color: "#fff" }}>1</div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8eaed" }}>Add LINE Bot เป็นเพื่อน</p>
                {LINE_BOT_ID ? (
                  <a
                    href={`https://line.me/R/ti/p/@${LINE_BOT_ID}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ backgroundColor: "#06c755", color: "#fff" }}
                  >
                    Add Friend
                  </a>
                ) : (
                  <p className="text-xs" style={{ color: "#9aa0a6" }}>สแกน QR Code จากผู้ดูแลระบบ</p>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: "#06c755", color: "#fff" }}>2</div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8eaed" }}>ทักข้อความอะไรก็ได้</p>
                <p className="text-xs" style={{ color: "#9aa0a6" }}>Bot จะตอบกลับพร้อม User ID ของคุณ</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: "#06c755", color: "#fff" }}>3</div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8eaed" }}>Copy User ID ใส่ในช่องด้านบน</p>
                <p className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: "#3c3f43", color: "#9aa0a6" }}>
                  ตัวอย่าง: U1a2b3c4d5e6f...
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
