import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, TooltipProps,
} from "recharts";
import { ChartDataPoint, Fund } from "../types";
import { fmt, FUND_COLORS } from "../utils/format";

interface NavChartProps {
  chartData: ChartDataPoint[];
  allFunds: Fund[];
  overlayIds: string[];
  activeFundId: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#151C28",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 12,
      fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6, fontSize: 11 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{fmt.currency(p.value as number)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function NavChart({ chartData, allFunds, overlayIds, activeFundId }: NavChartProps) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 10,
      padding: "20px 24px",
      marginBottom: 24,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>NAV Performance</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
            12-month net asset value · 2024
          </div>
        </div>

        {/* Overlay legend — shown only when more than one fund is selected */}
        {overlayIds.length > 1 && (
          <div style={{ display: "flex", gap: 12 }}>
            {overlayIds.map(id => {
              const fund = allFunds.find(f => f.id === id);
              const idx = allFunds.findIndex(f => f.id === id);
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 2, background: FUND_COLORS[idx], borderRadius: 1 }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>
                    {fund?.name.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `$${(v / 1e6).toFixed(0)}M`}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />

          {overlayIds.map(id => {
            const idx = allFunds.findIndex(f => f.id === id);
            const isActive = id === activeFundId;
            return (
              <Line
                key={id}
                type="monotone"
                dataKey={id}
                name={allFunds[idx]?.name}
                stroke={FUND_COLORS[idx]}
                strokeWidth={isActive ? 2.5 : 1.5}
                dot={false}
                activeDot={{ r: 4, fill: FUND_COLORS[idx], stroke: "#0D1118", strokeWidth: 2 }}
                strokeOpacity={isActive ? 1 : 0.5}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
