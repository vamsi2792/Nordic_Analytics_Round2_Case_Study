export const fmt = {
  currency: (v: number): string => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    return `$${v.toLocaleString()}`;
  },
  pct: (v: number): string => `${v.toFixed(1)}%`,
  mult: (v: number): string => `${v.toFixed(2)}x`,
  monthAbbr: (m: string): string => {
    const [, mo] = m.split("-");
    const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return names[parseInt(mo) - 1];
  },
};

export const FUND_COLORS = ["#6DB8E8", "#E8A838", "#7BC67E"] as const;
