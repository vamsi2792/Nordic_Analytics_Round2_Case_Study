import { useState, useMemo } from "react";
import fundsData from "./data/funds";
import { fmt } from "./utils/format";
import { ChartDataPoint } from "./types";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import KpiCard from "./components/KpiCard";
import NavChart from "./components/NavChart";
import PortfolioTable from "./components/PortfolioTable";

export default function App() {
  const [selectedId, setSelectedId] = useState<string>("fund-001");
  const [overlayIds, setOverlayIds] = useState<string[]>(["fund-001"]);
  const [activeTab, setActiveTab]   = useState<"overview" | "portfolio">("overview");

  const fund = fundsData.funds.find(f => f.id === selectedId)!;

  const chartData = useMemo<ChartDataPoint[]>(() => {
    return fund.navHistory.map((h, i) => {
      const point: ChartDataPoint = { month: fmt.monthAbbr(h.month) };
      fundsData.funds.forEach(f => {
        if (overlayIds.includes(f.id)) point[f.id] = f.navHistory[i]?.nav;
      });
      return point;
    });
  }, [overlayIds, fund]);

  const handleSelectFund = (id: string) => {
    setSelectedId(id);
    setActiveTab("overview");
    if (!overlayIds.includes(id)) setOverlayIds([id]);
  };

  const handleToggleOverlay = (id: string) => {
    setOverlayIds(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(x => x !== id) : prev
        : [...prev, id]
    );
  };

  const kpis = [
    { label: "IRR",  value: fmt.pct(fund.metrics.irr),      sub: "Internal Rate of Return",   accent: "#6DB8E8" },
    { label: "TVPI", value: fmt.mult(fund.metrics.tvpi),    sub: "Total Value / Paid-In",      accent: "#7BC67E" },
    { label: "DPI",  value: fmt.mult(fund.metrics.dpi),     sub: "Distributions / Paid-In",    accent: "#E8A838" },
    { label: "RVPI", value: fmt.mult(fund.metrics.rvpi),    sub: "Residual Value / Paid-In",   accent: "#A78BFA" },
    { label: "NAV",  value: fmt.currency(fund.metrics.nav), sub: "of " + fmt.currency(fund.totalCommitments) + " committed", accent: "#38BDF8" },
  ];

  const tabs: Array<"overview" | "portfolio"> = ["overview", "portfolio"];

  const atRiskCompanies = fund.portfolioCompanies.filter(c => c.ebitdaMargin < 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0D1118", fontFamily: "'Sora', sans-serif", color: "#F2F4F7" }}>
      <Header />

      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <Sidebar
          funds={fundsData.funds}
          selectedId={selectedId}
          overlayIds={overlayIds}
          onSelectFund={handleSelectFund}
          onToggleOverlay={handleToggleOverlay}
        />

        <main style={{ flex: 1, padding: "28px 32px", overflowX: "hidden" }}>

          {/* Negative EBITDA alert banner — always visible regardless of active tab */}
          {atRiskCompanies.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
              background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.3)",
              borderRadius: 8, padding: "12px 16px",
            }}>
              <span style={{ color: "#EF5350", fontSize: 15, flexShrink: 0 }}>⚠</span>
              <span style={{ fontSize: 12, color: "#EF9F9E", fontFamily: "'DM Mono', monospace" }}>
                <strong style={{ color: "#EF5350" }}>Attention required · </strong>
                {atRiskCompanies.map(c => c.name).join(", ")} {atRiskCompanies.length === 1 ? "has" : "have"} a negative EBITDA margin
              </span>
            </div>
          )}

          {/* Fund heading + Tab switcher */}
          <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>
                {fund.name}
              </h1>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.35)" }}>
                  {fund.type} · Vintage {fund.vintage}
                </span>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.35)" }}>
                  {fund.portfolioCompanies.length} Portfolio Companies
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "7px 18px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: "1px solid",
                    borderColor: activeTab === tab ? "rgba(109,184,232,0.4)" : "rgba(255,255,255,0.08)",
                    background:  activeTab === tab ? "rgba(109,184,232,0.1)" : "transparent",
                    color:       activeTab === tab ? "#6DB8E8" : "rgba(255,255,255,0.4)",
                    cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12, marginBottom: 24 }}>
                {kpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
              </div>
              <NavChart
                chartData={chartData}
                allFunds={fundsData.funds}
                overlayIds={overlayIds}
                activeFundId={selectedId}
              />
            </>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === "portfolio" && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 0 8px" }}>
              <div style={{ padding: "0 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Portfolio Companies</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                    {fund.portfolioCompanies.length} holdings · click column header to sort
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[{ label: "Active", color: "#7BC67E" }, { label: "Watch", color: "#E8A838" }, { label: "At Risk", color: "#EF5350" }].map(b => (
                    <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: b.color }} />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <PortfolioTable companies={fund.portfolioCompanies} />
            </div>
          )}

          <div style={{ marginTop: 28, textAlign: "center", padding: "12px 0" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
              Nordic Analytics · Confidential · Data as of 2024-12-31
            </span>
          </div>

        </main>
      </div>
    </div>
  );
}