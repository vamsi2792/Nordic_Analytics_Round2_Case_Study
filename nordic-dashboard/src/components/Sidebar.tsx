import { Fund } from "../types";
import { FUND_COLORS } from "../utils/format";

interface SidebarProps {
  funds: Fund[];
  selectedId: string;
  overlayIds: string[];
  onSelectFund: (id: string) => void;
  onToggleOverlay: (id: string) => void;
}

export default function Sidebar({ funds, selectedId, overlayIds, onSelectFund, onToggleOverlay }: SidebarProps) {
  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.06)",
      padding: "24px 0",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      {/* ── Fund Selector ── */}
      <div style={{
        padding: "0 20px 12px",
        fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace",
      }}>
        Funds
      </div>

      {funds.map((fund, i) => {
        const isSelected = fund.id === selectedId;
        return (
          <button
            key={fund.id}
            onClick={() => onSelectFund(fund.id)}
            style={{
              width: "100%", textAlign: "left", padding: "10px 20px",
              background: isSelected ? "rgba(109,184,232,0.08)" : "transparent",
              borderLeft: `2px solid ${isSelected ? FUND_COLORS[i] : "transparent"}`,
              border: "none", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <div style={{
              fontSize: 12,
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? "#F2F4F7" : "rgba(255,255,255,0.45)",
              lineHeight: 1.3, marginBottom: 4,
            }}>
              {fund.name}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: FUND_COLORS[i], opacity: 0.8 }}>
                {fund.type}
              </span>
              <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.2)" }}>
                · {fund.vintage}
              </span>
            </div>
          </button>
        );
      })}

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />

      {/* ── NAV Overlay Toggles (Bonus) ── */}
      <div style={{
        padding: "0 20px 10px",
        fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace",
      }}>
        Nav Overlay
      </div>

      {funds.map((fund, i) => {
        const isChecked = overlayIds.includes(fund.id);
        return (
          <label
            key={fund.id}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 20px", cursor: "pointer" }}
          >
            <div
              onClick={() => onToggleOverlay(fund.id)}
              style={{
                width: 14, height: 14, borderRadius: 3,
                border: `1.5px solid ${FUND_COLORS[i]}`,
                background: isChecked ? FUND_COLORS[i] : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s", cursor: "pointer",
              }}
            >
              {isChecked && <span style={{ color: "#0D1118", fontSize: 9, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.3 }}>
              {fund.name.split(" ").slice(0, 2).join(" ")}
            </span>
          </label>
        );
      })}
    </aside>
  );
}
