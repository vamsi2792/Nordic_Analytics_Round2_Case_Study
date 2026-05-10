
interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

export default function KpiCard({ label, value, sub, accent = "#6DB8E8" }: KpiCardProps) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: 3, height: "100%",
        background: accent,
        borderRadius: "8px 0 0 8px",
      }} />
      <span style={{
        fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.38)", fontFamily: "'DM Mono', monospace", fontWeight: 500,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 26, fontWeight: 700, color: "#F2F4F7",
        fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em", lineHeight: 1,
      }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
          {sub}
        </span>
      )}
    </div>
  );
}
