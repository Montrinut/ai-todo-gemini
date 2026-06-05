const priorityBorder = {
  high: "#f28b82",
  medium: "#fbbc04",
  low: "#81c995",
};

const statusLabel = { todo: "📋 Todo", doing: "⚡ กำลังทำ", done: "✅ เสร็จแล้ว" };

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const borderColor = priorityBorder[task.priority] || "#3c3f43";

  return (
    <div
      className="break-inside-avoid mb-4 rounded-xl p-4 group relative transition-shadow"
      style={{
        backgroundColor: "#2d2e30",
        border: `1px solid ${borderColor}`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Title */}
      <h3
        className="font-medium text-sm mb-1"
        style={{
          color: task.status === "done" ? "#9aa0a6" : "#e8eaed",
          textDecoration: task.status === "done" ? "line-through" : "none",
        }}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs mb-2" style={{ color: "#9aa0a6" }}>{task.description}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {task.category && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3c3f43", color: "#9aa0a6" }}>
            📂 {task.category}
          </span>
        )}
        {task.estimated_hours && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3c3f43", color: "#9aa0a6" }}>
            ⏱ {task.estimated_hours} ชม.
          </span>
        )}
        {task.deadline && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3c3f43", color: "#fbbc04" }}>
            🗓 {new Date(task.deadline).toLocaleDateString("th-TH")}
          </span>
        )}
      </div>

      {/* AI suggestion */}
      {task.ai_suggestion && (
        <p className="text-xs px-2 py-1 rounded mb-2" style={{ backgroundColor: "#3c3f43", color: "#c58af9" }}>
          🤖 {task.ai_suggestion}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-xs px-2 py-0.5 rounded-full outline-none cursor-pointer"
          style={{ backgroundColor: "#3c3f43", color: "#e8eaed", border: "none" }}
        >
          {["todo", "doing", "done"].map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "#9aa0a6" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#f28b82"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#9aa0a6"}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
