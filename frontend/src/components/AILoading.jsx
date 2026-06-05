export default function AILoading() {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "rgba(32,33,36,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#2d2e30",
          border: "1px solid #3c3f43",
          borderRadius: 20,
          padding: "40px 48px",
          textAlign: "center",
          minWidth: 280,
        }}
      >
        {/* Pulsing brain */}
        <div style={{ fontSize: 56, marginBottom: 16, animation: "pulse 1.2s ease-in-out infinite" }}>
          🤖
        </div>

        {/* Dots animation */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8,
                borderRadius: "50%",
                backgroundColor: "#fdd663",
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        <p style={{ color: "#e8eaed", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
          AI กำลังวิเคราะห์...
        </p>
        <p style={{ color: "#9aa0a6", fontSize: 12 }}>
          กำหนด priority, หมวดหมู่ และเวลาให้อัตโนมัติ
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
