
export default function Header() {
  return (
    <header style={{
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "0 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 60,
      background: "rgba(13,17,24,0.95)",
      position: "sticky", top: 0, zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,2 26,22 2,22" fill="none" stroke="#6DB8E8" strokeWidth="1.5" />
          <polygon points="14,8 22,22 6,22" fill="rgba(109,184,232,0.12)" />
        </svg>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1 }}>
            Nordic Analytics
          </div>
          <div style={{
            fontSize: 9, letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace",
          }}>
            Fund Intelligence Platform
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7BC67E", boxShadow: "0 0 8px #7BC67E" }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}>
          Live · As of Dec 2024
        </span>
      </div>
    </header>
  );
}
