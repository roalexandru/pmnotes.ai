# Role
You are a Senior Frontend Engineer specializing in data-rich React dashboards with production-quality UI and robust data handling.

# Context
We need a fully functional analytics dashboard prototype called **"{{dashboard_name}}"** that can be used for stakeholder demos, internal tooling, or as the foundation of a shipped product. This is not a wireframe — it should look polished, handle real data patterns (loading, errors, empty states), and be structured for easy extension.

# Inputs
- **Dashboard Name**: {{dashboard_name}}
- **Key Metrics**: {{metrics}}
- **Charts & Visualizations**: {{chart_types}}
- **Filters & Controls**: {{filters}}
- **Data Source**: {{data_source}}
- **Design Preferences**: {{design_preferences}}

# Task
Build a complete analytics dashboard as a set of React (TypeScript) components. Deliver every section listed below as working code. Use modern React patterns (hooks, composition, context where appropriate) and structure the code so a team can extend it easily.

---

## 1. Type Definitions

Define all TypeScript interfaces and types up front in a dedicated `types.ts` file:

- **Metric**: id, label, value (number), formattedValue (string), unit, trend (direction: `up` | `down` | `flat`, percentage: number), previousValue, sparklineData (number[])
- **TimeSeriesDataPoint**: date (string), value (number), comparePeriodValue? (number)
- **ChartConfig**: id, title, type (`line` | `area` | `bar` | `heatmap` | `map`), dataKey, color, data
- **FilterState**: dateRange, selectedFilters (Record<string, string[]>), comparePreviousPeriod (boolean)
- **TableRow**: generic record type with id, sortable fields, expandable detail
- **ApiResponse<T>**: data, loading, error, lastUpdated

Ensure all components use these types — no `any` types anywhere.

## 2. Dashboard Architecture

Provide a brief component tree comment at the top of the main dashboard file showing:

```
Dashboard (layout shell)
├── DashboardHeader (title, last-updated, refresh button)
├── FilterBar (date range, dropdowns, toggles)
├── KPIGrid (responsive grid of MetricCard components)
│   └── MetricCard (value, trend, sparkline)
├── ChartsSection (responsive grid of chart widgets)
│   ├── TimeSeriesChart (line/area with optional comparison overlay)
│   ├── BarChart (breakdowns, categories)
│   └── Additional chart types as needed
├── DataTable (sortable, paginated, expandable rows)
└── Footer (export button, timestamp)
```

Describe the data flow: which component owns filter state, how filter changes propagate to data-fetching hooks, and how charts/tables react to new data.

## 3. Dashboard Shell & Layout

Create the main `Dashboard` component:

- **Header**: Dashboard title ("{{dashboard_name}}"), subtitle with last-updated timestamp, and a manual refresh button
- **Sidebar** (optional — include if the design supports it): Navigation links for dashboard sections or other dashboards
- **Main content area**: Scrollable, with sections for KPIs, charts, and the data table
- **Responsive grid**: Use CSS Grid or Flexbox. Desktop: multi-column layout. Tablet: 2 columns. Mobile: single column stack
- Apply the design preferences: {{design_preferences}}

## 4. KPI Summary Cards

Create a `MetricCard` component for each metric in: {{metrics}}

Each card must include:
- **Metric label** and **current value** (formatted appropriately — currency, percentage, integer, etc.)
- **Trend indicator**: Up/down arrow icon with percentage change, color-coded (green for positive, red for negative — context-aware so "churn up" is red)
- **Sparkline**: A small inline chart (use Recharts `<Sparklines>` or a tiny `<LineChart>` with no axes) showing the last 7-12 data points
- **Previous period comparison**: Small text showing "vs. [previous value]"
- Card should have hover state and subtle animation

Wrap all cards in a `KPIGrid` component that lays them out in a responsive grid.

## 5. Chart Components

Build chart components for each visualization in: {{chart_types}}

### TimeSeriesChart (line/area)
- X-axis: dates (formatted nicely — "Jan", "Feb" or "Mar 1", "Mar 2" depending on range)
- Y-axis: metric values with proper formatting
- Tooltip on hover showing exact value + date
- Optional: overlay a semi-transparent comparison series for "previous period"
- Responsive container that resizes with the parent
- Legend if multiple series

### BarChart (breakdowns)
- Horizontal or vertical bars
- Labels, values on hover
- Color-coded by category

### Additional charts
For any remaining chart types in the input (heatmap, map, etc.), provide a placeholder component with a clear interface so it can be implemented later, or provide a simplified version.

All charts should:
- Use Recharts (or the library specified in design preferences)
- Have loading skeletons while data is fetching
- Show an empty state message when there is no data
- Be wrapped in a card/widget container with a title and optional subtitle

## 6. Filter Bar

Create a `FilterBar` component that implements: {{filters}}

- **Date range picker**: Preset buttons (7d, 30d, 90d) plus a custom date range input
- **Dropdown filters**: Single or multi-select as appropriate, with "All" as default
- **Toggle switches**: For boolean options like "Compare to previous period"
- Filter state should be lifted to the Dashboard level (via context or props) so all data-fetching hooks can react to it
- Optionally sync filter state to URL search params so the dashboard state is shareable
- Clear all / reset filters button
- Responsive: on mobile, collapse into a slide-out drawer or accordion

## 7. Data Table

Create a `DataTable` component:

- **Columns**: Derive from the metrics/data. Include at minimum: name/label, key metric values, trend
- **Sorting**: Click column headers to sort ascending/descending. Show sort indicator arrow
- **Pagination**: Show 10-25 rows per page with page controls (previous, next, page numbers)
- **Row expansion** (optional): Click a row to expand and show detail content (a mini chart or detail fields)
- **Empty state**: Friendly message when no data matches filters
- **Loading state**: Skeleton rows while fetching
- Responsive: on mobile, allow horizontal scroll or collapse less-important columns

## 8. Data Layer (Hooks & API Client)

Create custom hooks that connect to: {{data_source}}

- `useMetrics(filters: FilterState)` — fetches summary KPI data
- `useTimeSeries(metric: string, filters: FilterState)` — fetches chart data for a specific metric
- `useBreakdown(dimension: string, filters: FilterState)` — fetches breakdown/category data
- `useTableData(filters: FilterState, sort: SortConfig, page: number)` — fetches paginated table data

Each hook should:
- Return `{ data, isLoading, error, refetch }` (use a pattern compatible with TanStack Query or a simple `useEffect` + `useState` approach)
- Include mock data fallback so the dashboard works without a running API
- Handle error states gracefully (show error UI, offer retry)
- Support auto-refresh / polling interval (optional, configurable)

Provide a thin API client module (`api.ts`) with typed fetch functions that the hooks call.

## 9. Loading, Error & Empty States

Every data-driven component must handle three states:

- **Loading**: Skeleton placeholders that match the shape of the real content (not just a spinner). Cards show pulsing rectangles, charts show a pulsing chart outline, table shows skeleton rows.
- **Error**: A clear error message with a "Retry" button. Do not crash the whole dashboard if one widget fails.
- **Empty**: A friendly illustration or message ("No data for the selected period") with a suggestion to adjust filters.

## 10. Polish & Accessibility

- Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<table>`)
- ARIA labels on interactive elements (buttons, filters, sortable columns)
- Keyboard navigable (tab order, enter to activate)
- Proper color contrast ratios
- Animations: subtle transitions on hover, smooth chart animations on data load
- Dark/light mode support if applicable to the design preferences

# Output Format

Deliver the code as a set of clearly-labeled files:

1. `types.ts` — All TypeScript interfaces
2. `api.ts` — API client with typed fetch functions
3. `hooks.ts` — All custom data-fetching hooks
4. `Dashboard.tsx` — Main dashboard layout component
5. `FilterBar.tsx` — Filter bar component
6. `MetricCard.tsx` — Single KPI card component
7. `KPIGrid.tsx` — Grid of metric cards
8. `TimeSeriesChart.tsx` — Line/area chart component
9. `BarChart.tsx` — Bar chart component
10. `DataTable.tsx` — Sortable, paginated data table
11. `LoadingStates.tsx` — Skeleton components
12. `mockData.ts` — Realistic mock data for all components

For each file, include all imports, exports, and ensure they wire together. The dashboard should render correctly if all files are placed in the same directory and `Dashboard.tsx` is mounted as the root component.

Include realistic mock data so the dashboard looks impressive immediately without needing a live API.
