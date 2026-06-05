import { useState } from "react";

export default function TaskForm({ onSubmit, loading, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "todo",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    });
    setForm({ title: "", description: "", deadline: "", status: "todo" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="rounded-xl p-4 shadow-2xl"
      style={{ backgroundColor: "#2d2e30", border: "1px solid #5f6368" }}
      onKeyDown={handleKeyDown}
    >
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="ชื่อ Task"
        autoFocus
        className="w-full bg-transparent outline-none font-medium text-sm mb-3"
        style={{ color: "#e8eaed" }}
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="รายละเอียด..."
        rows={2}
        className="w-full bg-transparent outline-none text-sm resize-none mb-3"
        style={{ color: "#e8eaed" }}
      />

      <input
        type="datetime-local"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full text-xs mb-4 px-2 py-1 rounded outline-none"
        style={{ backgroundColor: "#3c3f43", color: "#9aa0a6", border: "none" }}
      />

      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: "#9aa0a6" }}>🤖 AI วิเคราะห์อัตโนมัติ</span>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-1 rounded-full transition"
            style={{ color: "#9aa0a6" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3c3f43"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            ปิด
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-sm px-4 py-1 rounded-full font-medium transition"
            style={{ backgroundColor: "#fdd663", color: "#202124", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "⏳..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}
