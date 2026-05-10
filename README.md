# Nordic Analytics — Fund Intelligence Dashboard

A portfolio performance dashboard for fund managers, built as a single-page React + TypeScript application.

---

## Running the project locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd nordic-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Requires **Node 18+**. The app runs on `http://localhost:5173` (Vite default).

No environment variables or external services are required.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Inline styles with CSS variables (no Tailwind dependency) |
| Charts | Recharts |
| Data | Static `funds.json` imported directly — no backend |

---

## Key technical decisions

### 1. Static JSON import over json-server
The brief allowed either a static import or a mock API with json-server. I chose a direct import. There's no async complexity, no server to spin up, and no failure surface — which keeps the focus on the UI layer where this role lives.

### 2. Recharts for charting
Recharts is composable, has a clean declarative API that matches React's mental model, and produces accessible SVG output. It also supports the multi-series overlay (bonus requirement) without needing a separate data transformation layer — just adding extra `<Line>` components is enough.

### 3. Inline styles over Tailwind
The brief says Tailwind is "strongly preferred," and I'd use it in a production codebase. For this self-contained artifact submission, inline styles with a central design token object keep the component fully portable and avoid any build configuration. Every spacing, color, and typography decision is still deliberate and consistent — it's just enforced by convention rather than by a utility class list.

### 4. Sorting state lives in `PortfolioTable`
Column sort state is local to the table component rather than hoisted. It resets on fund switch (desired UX — each fund's table starts with the default sort) and doesn't pollute the top-level dashboard state.

### 5. MOIC as a derived column
MOIC (Multiple on Invested Capital = currentValue / investedCapital) is not in the dataset but is a standard PE metric that any fund manager would expect to see alongside current value. I computed it inline in the column renderer.

---

## Bonus features implemented

- **Multi-fund NAV overlay** — sidebar checkboxes toggle individual funds on the chart. The active fund is rendered at full opacity and thicker stroke; overlaid funds are dimmed. A minimum of one fund is always selected.
- **Column sorting** — clicking any numeric column header sorts ascending/descending, with a directional arrow indicator.
- **Responsive layout** — KPI cards use `auto-fill` grid so they reflow at narrower widths. The sidebar and table scroll horizontally on small screens.
- **Negative EBITDA alert banner** — displayed at the top of the main content area, above the tab strip, so it is visible regardless of which tab is active. This was a deliberate read of the spec — "display a banner" implies always-on, not buried inside the Portfolio tab.

---

## What I would improve given more time

1. **Runtime schema validation** — TypeScript catches shape mismatches at compile time, but if the data source changed (e.g. a real API returning unexpected nulls), there is no runtime guard. I'd add a Zod schema at the data boundary so bad data fails loudly rather than silently rendering wrong values.

2. **Animation** — fund switching could animate the KPI cards (number counting up, chart line drawing in). The sidebar selection transition is currently instant.

3. **Filtering** — a sector or country filter above the portfolio table would be natural for a fund with many holdings.

4. **Accessibility** — the chart tooltips and table sort buttons need `aria-label` and keyboard-focus styles to meet WCAG 2.1 AA. The color coding for at-risk / watch status also needs a non-color indicator (icon) for colorblind users.
---

## Known limitations

- Data is static. There is no real-time update or API polling.
- The chart Y-axis scale is per-overlay, so comparing absolute NAV values across funds with very different AUM sizes (e.g., €80M VC fund vs €400M growth fund) may compress the smaller fund's line visually. A dual-axis or normalized (%) toggle would address this.
- The table does not support text-column sorting (Company Name, Sector, Country) — only numeric columns are sortable. This is a minor UX gap.