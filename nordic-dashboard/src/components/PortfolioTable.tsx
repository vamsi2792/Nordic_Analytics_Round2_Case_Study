import React, { useState, useMemo } from "react";
import { PortfolioCompany } from "../types";
import { fmt } from "../utils/format";

// ─── Flag Badge ───────────────────────────────────────────────────────────────

interface FlagBadgeProps {
  flag: string;
}

function FlagBadge({ flag }: FlagBadgeProps) {
  const styles: Record<string, { bg: string; color: string; border: string; label: string }> = {
    watch:    { bg: "rgba(232,168,56,0.15)",  color: "#E8A838", border: "rgba(232,168,56,0.3)",  label: "Watch" },
    "at-risk":{ bg: "rgba(239,83,80,0.15)",   color: "#EF5350", border: "rgba(239,83,80,0.3)",   label: "At Risk" },
  };
  const s = styles[flag];
  if (!s) return null;
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 4, padding: "2px 7px", fontFamily: "'DM Mono', monospace",
    }}>
      {s.label}
    </span>
  );
}

// ─── Column Config ─────────────────────────────────────────────────────────────

type SortFn = (row: PortfolioCompany) => number;

interface ColConfig {
  key: string;
  label: string;
  align: "left" | "right";
  render: (row: PortfolioCompany) => React.ReactNode;
  sort?: SortFn;
}

const COL_CONFIG: ColConfig[] = [
  {
    key: "name", label: "Company", align: "left",
    render: (row) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontWeight: 600, color: "#F2F4F7" }}>{row.name}</span>
        <div style={{ display: "flex", gap: 5 }}>
          {row.flags.map(f => <FlagBadge key={f} flag={f} />)}
        </div>
      </div>
    ),
  },
  { key: "sector",  label: "Sector",  align: "left",  render: (row) => row.sector },
  { key: "country", label: "Country", align: "left",  render: (row) => row.country },
  {
    key: "revenue", label: "Revenue", align: "right",
    render: (row) => fmt.currency(row.revenue),
    sort: (row) => row.revenue,
  },
  {
    key: "ebitda", label: "EBITDA", align: "right",
    render: (row) => (
      <span style={{ color: row.ebitda < 0 ? "#EF5350" : "#7BC67E" }}>
        {fmt.currency(row.ebitda)}
      </span>
    ),
    sort: (row) => row.ebitda,
  },
  {
    key: "ebitdaMargin", label: "EBITDA Margin", align: "right",
    render: (row) => (
      <span style={{ color: row.ebitdaMargin < 0 ? "#EF5350" : row.ebitdaMargin > 20 ? "#7BC67E" : "#F2F4F7" }}>
        {fmt.pct(row.ebitdaMargin)}
      </span>
    ),
    sort: (row) => row.ebitdaMargin,
  },
  {
    key: "currentValue", label: "Current Value", align: "right",
    render: (row) => fmt.currency(row.currentValue),
    sort: (row) => row.currentValue,
  },
  {
    key: "moic", label: "MOIC", align: "right",
    render: (row) => {
      const moic = row.currentValue / row.investedCapital;
      return (
        <span style={{ color: moic >= 2 ? "#7BC67E" : moic >= 1 ? "#F2F4F7" : "#EF5350" }}>
          {fmt.mult(moic)}
        </span>
      );
    },
    sort: (row) => row.currentValue / row.investedCapital,
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

interface PortfolioTableProps {
  companies: PortfolioCompany[];
}

export default function PortfolioTable({ companies }: PortfolioTableProps) {
  const [sortKey, setSortKey] = useState<string>("currentValue");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const sorted = useMemo(() => {
    const col = COL_CONFIG.find(c => c.key === sortKey);
    if (!col?.sort) return companies;
    return [...companies].sort((a, b) => sortDir * (col.sort!(a) - col.sort!(b)));
  }, [companies, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(-1); }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {COL_CONFIG.map(col => (
              <th
                key={col.key}
                onClick={() => col.sort && handleSort(col.key)}
                style={{
                  padding: "10px 14px", textAlign: col.align,
                  fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: sortKey === col.key ? "#6DB8E8" : "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Mono', monospace", fontWeight: 500,
                  cursor: col.sort ? "pointer" : "default",
                  userSelect: "none", whiteSpace: "nowrap",
                }}
              >
                {col.label}
                {col.sort && sortKey === col.key && (
                  <span style={{ marginLeft: 4 }}>{sortDir === 1 ? "↑" : "↓"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((company, i) => {
            const isAtRisk = company.flags.includes("at-risk");
            const isWatch  = company.flags.includes("watch");
            return (
              <tr
                key={company.id}
                style={{
                  background: isAtRisk
                    ? "rgba(239,83,80,0.06)"
                    : isWatch
                    ? "rgba(232,168,56,0.05)"
                    : i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.15s",
                }}
              >
                {COL_CONFIG.map(col => (
                  <td
                    key={col.key}
                    style={{
                      padding: "13px 14px",
                      textAlign: col.align,
                      color: "rgba(255,255,255,0.65)",
                      borderLeft: col.key === "name"
                        ? isAtRisk ? "2px solid #EF5350"
                        : isWatch  ? "2px solid #E8A838"
                        : undefined
                        : undefined,
                    }}
                  >
                    {col.render(company)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}