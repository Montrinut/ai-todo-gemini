import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { analyzeDashboard } from "../services/api";

const CARD = { backgroundColor: "#2d2e30", border: "1px solid #3c3f43", borderRadius: "16px", padding: "20px" };
const TEXT = { color: "#e8eaed" };
const SUB  = { color: "#9aa0a6" };

const STATUS_COLORS = { todo: "#5f6368", doing: "#fbbc04", done: "#81c995" };
const STATUS_LABELS = { todo: "Todo", doing: "กำลังทำ", done: "เสร็จแล้ว" };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#3c3f43", border: "1px solid #5f6368", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#e8eaed", fontSize: 13 }}>{payload[0].name}: <strong>{payload[0].value}</strong></p>
    </div>
  );
};

export default function Dashboard({ tasks }) {
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── คำนวณข้อมูล ─────────────────────────────────────────
  const statusCount   = { todo: 0, doing: 0, done: 0 };
  const priorityCount = { high: 0, medium: 0, low: 0 };
  const categoryCount = {};

  tasks.forEach((t) => {
    statusCount[t.status]   = (statusCount[t.status]   || 0) + 1;
    priorityCount[t.priority] = (priorityCount[t.priority] || 0) + 1;
    const cat = t.category || "other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const statusData = Object.entries(statusCount)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: STATUS_LABELS[k], value: v, key: k }));

  const priorityData = [
    { name: "สูง",  value: priorityCount.high,   fill: "#f28b82" },
    { name: "กลาง", value: priorityCount.medium, fill: "#fbbc04" },
    { name: "ต่ำ",  value: priorityCount.low,    fill: "#81c995" },
  ];

  const categoryData = Object.entries(categoryCount).map(([k, v]) => ({ name: k, value: v }));

  const total    = tasks.length;
  const doneRate = total ? Math.round((statusCount.done / total) * 100) : 0;

  const handleAnalyze = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const data = await analyzeDashboard();
      setAiResult(data);
    } catch {
      setAiResult({ summary: "เชื่อมต่อ AI ไม่ได้", top_priority: [], suggestions: [], risk: null });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ ...TEXT, fontSize: 20, fontWeight: 600, margin: 0 }}>Dashboard</h2>
        <button
          onClick={handleAnalyze}
          disabled={aiLoading}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            backgroundColor: aiLoading ? "#3c3f43" : "#fdd663",
            color: aiLoading ? "#9aa0a6" : "#202124",
            border: "none", borderRadius: 50, padding: "8px 20px",
            fontSize: 13, fontWeight: 600, cursor: aiLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {aiLoading ? (
            <>
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</span>
              AI กำลังวิเคราะห์...
            </>
          ) : (
            <> 🤖 วิเคราะห์ด้วย AI </>
          )}
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Task ทั้งหมด",  value: total,                  color: "#e8eaed" },
          { label: "กำลังทำ",       value: statusCount.doing || 0, color: "#fbbc04" },
          { label: "เสร็จแล้ว",     value: statusCount.done  || 0, color: "#81c995" },
          { label: "อัตราเสร็จงาน", value: `${doneRate}%`,         color: "#c58af9" },
        ].map((c) => (
          <div key={c.label} style={CARD}>
            <p style={{ ...SUB, fontSize: 12, marginBottom: 6 }}>{c.label}</p>
            <p style={{ color: c.color, fontSize: 28, fontWeight: 700, margin: 0 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* ── AI Analysis Result ── */}
      {(aiLoading || aiResult) && (
        <div style={{ ...CARD, marginBottom: 20, border: "1px solid #c58af9" }}>
          <p style={{ ...TEXT, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            🤖 AI วิเคราะห์ภาพรวม
          </p>

          {aiLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[0,1,2].map((i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fdd663",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <span style={{ ...SUB, fontSize: 13 }}>กำลังประมวลผล...</span>
            </div>
          ) : aiResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Summary */}
              <p style={{ ...TEXT, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{aiResult.summary}</p>

              {/* Risk */}
              {aiResult.risk && (
                <div style={{ backgroundColor: "rgba(242,139,130,0.1)", border: "1px solid #f28b82", borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ color: "#f28b82", fontSize: 13, margin: 0 }}>
                    ⚠️ <strong>ความเสี่ยง:</strong> {aiResult.risk}
                  </p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Top Priority */}
                {aiResult.top_priority?.length > 0 && (
                  <div>
                    <p style={{ ...SUB, fontSize: 12, marginBottom: 8 }}>ควรทำก่อน</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {aiResult.top_priority.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#fbbc04", fontWeight: 700, fontSize: 13, minWidth: 18 }}>{i + 1}.</span>
                          <span style={{ ...TEXT, fontSize: 13 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {aiResult.suggestions?.length > 0 && (
                  <div>
                    <p style={{ ...SUB, fontSize: 12, marginBottom: 8 }}>คำแนะนำ</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {aiResult.suggestions.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#81c995", fontSize: 13 }}>•</span>
                          <span style={{ ...TEXT, fontSize: 13 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Donut — Status */}
        <div style={CARD}>
          <p style={{ ...TEXT, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>สถานะงาน</p>
          {total === 0 ? (
            <p style={{ ...SUB, textAlign: "center", paddingTop: 40 }}>ยังไม่มีข้อมูล</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar — Priority */}
        <div style={CARD}>
          <p style={{ ...TEXT, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>ความสำคัญ</p>
          {total === 0 ? (
            <p style={{ ...SUB, textAlign: "center", paddingTop: 40 }}>ยังไม่มีข้อมูล</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c3f43" />
                <XAxis dataKey="name" tick={{ fill: "#9aa0a6", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#9aa0a6", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bar — Category */}
      {categoryData.length > 0 && (
        <div style={CARD}>
          <p style={{ ...TEXT, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>หมวดหมู่งาน</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3c3f43" />
              <XAxis dataKey="name" tick={{ fill: "#9aa0a6", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#9aa0a6", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="value" fill="#8ab4f8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
