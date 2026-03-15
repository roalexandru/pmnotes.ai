# Revenue & Growth Dashboard — Example Output

Below is the complete dashboard implementation based on the example inputs: a Revenue & Growth Dashboard with MRR, Active Users, Churn Rate, ARPU, Trial-to-Paid Conversion, and NPS metrics. Uses React, TypeScript, Recharts, and Tailwind CSS with a dark theme.

---

## 1. `types.ts`

```typescript
// types.ts — All TypeScript interfaces for the dashboard

export type TrendDirection = "up" | "down" | "flat";

export interface Metric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: "currency" | "percentage" | "number" | "score";
  trend: {
    direction: TrendDirection;
    percentage: number;
    isPositive: boolean; // context-aware: churn going up is NOT positive
  };
  previousValue: number;
  formattedPreviousValue: string;
  sparklineData: number[];
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  comparePeriodValue?: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: "line" | "area" | "bar" | "heatmap";
  dataKey: string;
  color: string;
  data: TimeSeriesDataPoint[];
}

export interface FilterState {
  dateRange: "7d" | "30d" | "90d" | "custom";
  customDateRange?: { start: string; end: string };
  planTier: string[];
  region: string[];
  comparePreviousPeriod: boolean;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface TableRow {
  id: string;
  name: string;
  mrr: number;
  users: number;
  churn: number;
  arpu: number;
  conversion: number;
  trend: TrendDirection;
  details?: Record<string, unknown>;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

export interface BreakdownDataPoint {
  label: string;
  value: number;
  color: string;
}
```

---

## 2. `api.ts`

```typescript
// api.ts — API client with typed fetch functions

import type {
  Metric,
  TimeSeriesDataPoint,
  BreakdownDataPoint,
  TableRow,
  FilterState,
  SortConfig,
} from "./types";
import {
  mockMetrics,
  mockTimeSeries,
  mockBreakdown,
  mockTableData,
} from "./mockData";

const BASE_URL = "/api/analytics";
const USE_MOCK = true; // Toggle to false when real API is available

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function buildParams(filters: FilterState): string {
  const params = new URLSearchParams();
  params.set("period", filters.dateRange);
  if (filters.planTier.length > 0) {
    params.set("plan", filters.planTier.join(","));
  }
  if (filters.region.length > 0) {
    params.set("region", filters.region.join(","));
  }
  if (filters.comparePreviousPeriod) {
    params.set("compare", "true");
  }
  return params.toString();
}

export async function fetchMetrics(filters: FilterState): Promise<Metric[]> {
  if (USE_MOCK) {
    await delay(600);
    return mockMetrics;
  }
  return fetchJson<Metric[]>(`${BASE_URL}/metrics/summary?${buildParams(filters)}`);
}

export async function fetchTimeSeries(
  metric: string,
  filters: FilterState
): Promise<TimeSeriesDataPoint[]> {
  if (USE_MOCK) {
    await delay(800);
    return mockTimeSeries[metric] ?? [];
  }
  return fetchJson<TimeSeriesDataPoint[]>(
    `${BASE_URL}/metrics/timeseries?metric=${metric}&${buildParams(filters)}`
  );
}

export async function fetchBreakdown(
  dimension: string,
  filters: FilterState
): Promise<BreakdownDataPoint[]> {
  if (USE_MOCK) {
    await delay(700);
    return mockBreakdown[dimension] ?? [];
  }
  return fetchJson<BreakdownDataPoint[]>(
    `${BASE_URL}/metrics/breakdown?by=${dimension}&${buildParams(filters)}`
  );
}

export async function fetchTableData(
  filters: FilterState,
  sort: SortConfig,
  page: number,
  pageSize: number
): Promise<{ rows: TableRow[]; total: number }> {
  if (USE_MOCK) {
    await delay(500);
    const sorted = [...mockTableData].sort((a, b) => {
      const aVal = a[sort.key as keyof TableRow];
      const bVal = b[sort.key as keyof TableRow];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    const start = (page - 1) * pageSize;
    return {
      rows: sorted.slice(start, start + pageSize),
      total: sorted.length,
    };
  }
  const params = buildParams(filters);
  return fetchJson<{ rows: TableRow[]; total: number }>(
    `${BASE_URL}/metrics/table?${params}&sort=${sort.key}&dir=${sort.direction}&page=${page}&size=${pageSize}`
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

## 3. `mockData.ts`

```typescript
// mockData.ts — Realistic mock data for all dashboard components

import type {
  Metric,
  TimeSeriesDataPoint,
  BreakdownDataPoint,
  TableRow,
} from "./types";

export const mockMetrics: Metric[] = [
  {
    id: "mrr",
    label: "MRR",
    value: 48200,
    formattedValue: "$48,200",
    unit: "currency",
    trend: { direction: "up", percentage: 12.3, isPositive: true },
    previousValue: 42900,
    formattedPreviousValue: "$42,900",
    sparklineData: [38100, 39200, 40800, 41500, 42200, 42900, 44100, 45300, 46000, 47100, 47800, 48200],
  },
  {
    id: "active-users",
    label: "Active Users",
    value: 12847,
    formattedValue: "12,847",
    unit: "number",
    trend: { direction: "up", percentage: 8.1, isPositive: true },
    previousValue: 11884,
    formattedPreviousValue: "11,884",
    sparklineData: [10200, 10500, 10900, 11200, 11400, 11884, 12100, 12300, 12500, 12600, 12750, 12847],
  },
  {
    id: "churn-rate",
    label: "Churn Rate",
    value: 3.2,
    formattedValue: "3.2%",
    unit: "percentage",
    trend: { direction: "down", percentage: 0.5, isPositive: true },
    previousValue: 3.7,
    formattedPreviousValue: "3.7%",
    sparklineData: [4.1, 4.0, 3.8, 3.9, 3.7, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2],
  },
  {
    id: "arpu",
    label: "ARPU",
    value: 3.75,
    formattedValue: "$3.75",
    unit: "currency",
    trend: { direction: "up", percentage: 4.2, isPositive: true },
    previousValue: 3.6,
    formattedPreviousValue: "$3.60",
    sparklineData: [3.2, 3.25, 3.3, 3.35, 3.4, 3.6, 3.55, 3.6, 3.65, 3.7, 3.72, 3.75],
  },
  {
    id: "trial-conversion",
    label: "Trial-to-Paid",
    value: 18.4,
    formattedValue: "18.4%",
    unit: "percentage",
    trend: { direction: "up", percentage: 2.1, isPositive: true },
    previousValue: 16.3,
    formattedPreviousValue: "16.3%",
    sparklineData: [14.2, 14.8, 15.1, 15.5, 15.9, 16.3, 16.8, 17.1, 17.5, 17.8, 18.1, 18.4],
  },
  {
    id: "nps",
    label: "NPS",
    value: 72,
    formattedValue: "72",
    unit: "score",
    trend: { direction: "up", percentage: 5.9, isPositive: true },
    previousValue: 68,
    formattedPreviousValue: "68",
    sparklineData: [62, 63, 64, 65, 66, 68, 68, 69, 70, 71, 71, 72],
  },
];

function generateMonthlyData(
  baseValue: number,
  growthRate: number,
  volatility: number,
  months: number
): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  let value = baseValue;
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const noise = (Math.random() - 0.5) * volatility;
    value = value * (1 + growthRate) + noise;
    data.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
      comparePeriodValue: Math.round(value * (0.85 + Math.random() * 0.1) * 100) / 100,
    });
  }
  return data;
}

export const mockTimeSeries: Record<string, TimeSeriesDataPoint[]> = {
  mrr: [
    { date: "2025-04", value: 38100, comparePeriodValue: 33200 },
    { date: "2025-05", value: 39200, comparePeriodValue: 34100 },
    { date: "2025-06", value: 40800, comparePeriodValue: 35500 },
    { date: "2025-07", value: 41500, comparePeriodValue: 36200 },
    { date: "2025-08", value: 42200, comparePeriodValue: 36900 },
    { date: "2025-09", value: 42900, comparePeriodValue: 37800 },
    { date: "2025-10", value: 44100, comparePeriodValue: 38400 },
    { date: "2025-11", value: 45300, comparePeriodValue: 39100 },
    { date: "2025-12", value: 46000, comparePeriodValue: 39900 },
    { date: "2026-01", value: 47100, comparePeriodValue: 40600 },
    { date: "2026-02", value: 47800, comparePeriodValue: 41200 },
    { date: "2026-03", value: 48200, comparePeriodValue: 42900 },
  ],
  "active-users": generateMonthlyData(9500, 0.025, 200, 12),
  "churn-rate": [
    { date: "2025-04", value: 4.1, comparePeriodValue: 4.8 },
    { date: "2025-05", value: 4.0, comparePeriodValue: 4.7 },
    { date: "2025-06", value: 3.8, comparePeriodValue: 4.5 },
    { date: "2025-07", value: 3.9, comparePeriodValue: 4.4 },
    { date: "2025-08", value: 3.7, comparePeriodValue: 4.3 },
    { date: "2025-09", value: 3.7, comparePeriodValue: 4.2 },
    { date: "2025-10", value: 3.6, comparePeriodValue: 4.1 },
    { date: "2025-11", value: 3.5, comparePeriodValue: 4.0 },
    { date: "2025-12", value: 3.4, comparePeriodValue: 3.9 },
    { date: "2026-01", value: 3.3, comparePeriodValue: 3.8 },
    { date: "2026-02", value: 3.2, comparePeriodValue: 3.7 },
    { date: "2026-03", value: 3.2, comparePeriodValue: 3.7 },
  ],
};

export const mockBreakdown: Record<string, BreakdownDataPoint[]> = {
  plan: [
    { label: "Free", value: 7200, color: "#6b7280" },
    { label: "Pro", value: 28400, color: "#3b82f6" },
    { label: "Business", value: 12600, color: "#8b5cf6" },
  ],
  region: [
    { label: "North America", value: 22100, color: "#3b82f6" },
    { label: "Europe", value: 14300, color: "#8b5cf6" },
    { label: "Asia Pacific", value: 8200, color: "#06b6d4" },
    { label: "Latin America", value: 2400, color: "#f59e0b" },
    { label: "Other", value: 1200, color: "#6b7280" },
  ],
};

export const mockTableData: TableRow[] = [
  { id: "1", name: "Pro Monthly", mrr: 18400, users: 4200, churn: 2.8, arpu: 4.38, conversion: 22.1, trend: "up" },
  { id: "2", name: "Pro Annual", mrr: 10000, users: 1800, churn: 1.2, arpu: 5.56, conversion: 28.4, trend: "up" },
  { id: "3", name: "Business Monthly", mrr: 8200, users: 820, churn: 3.1, arpu: 10.0, conversion: 14.2, trend: "flat" },
  { id: "4", name: "Business Annual", mrr: 4400, users: 340, churn: 0.9, arpu: 12.94, conversion: 18.7, trend: "up" },
  { id: "5", name: "Free", mrr: 0, users: 7200, churn: 5.8, arpu: 0, conversion: 0, trend: "down" },
  { id: "6", name: "Pro Trial", mrr: 3600, users: 1200, churn: 8.2, arpu: 3.0, conversion: 18.4, trend: "up" },
  { id: "7", name: "Business Trial", mrr: 1800, users: 420, churn: 6.5, arpu: 4.29, conversion: 12.8, trend: "flat" },
  { id: "8", name: "Enterprise Custom", mrr: 1800, users: 47, churn: 0.4, arpu: 38.3, conversion: 42.0, trend: "up" },
  { id: "9", name: "Pro (Legacy)", mrr: 0, users: 320, churn: 1.0, arpu: 0, conversion: 0, trend: "flat" },
  { id: "10", name: "Student Discount", mrr: 0, users: 479, churn: 2.1, arpu: 0, conversion: 8.2, trend: "up" },
  { id: "11", name: "Partner Referral", mrr: 0, users: 0, churn: 0, arpu: 0, conversion: 31.5, trend: "up" },
  { id: "12", name: "Startup Program", mrr: 0, users: 0, churn: 0.6, arpu: 0, conversion: 24.0, trend: "up" },
];
```

---

## 4. `hooks.ts`

```typescript
// hooks.ts — Custom data-fetching hooks for all dashboard data

import { useState, useEffect, useCallback } from "react";
import type {
  Metric,
  TimeSeriesDataPoint,
  BreakdownDataPoint,
  TableRow,
  FilterState,
  SortConfig,
  ApiResponse,
} from "./types";
import {
  fetchMetrics,
  fetchTimeSeries,
  fetchBreakdown,
  fetchTableData,
} from "./api";

function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[]
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        setData(result);
        setLastUpdated(new Date());
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, lastUpdated, refetch };
}

export function useMetrics(
  filters: FilterState
): ApiResponse<Metric[]> {
  return useAsyncData(
    () => fetchMetrics(filters),
    [filters.dateRange, filters.planTier.join(), filters.region.join()]
  );
}

export function useTimeSeries(
  metric: string,
  filters: FilterState
): ApiResponse<TimeSeriesDataPoint[]> {
  return useAsyncData(
    () => fetchTimeSeries(metric, filters),
    [metric, filters.dateRange, filters.comparePreviousPeriod]
  );
}

export function useBreakdown(
  dimension: string,
  filters: FilterState
): ApiResponse<BreakdownDataPoint[]> {
  return useAsyncData(
    () => fetchBreakdown(dimension, filters),
    [dimension, filters.dateRange, filters.planTier.join()]
  );
}

export function useTableData(
  filters: FilterState,
  sort: SortConfig,
  page: number,
  pageSize: number = 10
): ApiResponse<{ rows: TableRow[]; total: number }> {
  return useAsyncData(
    () => fetchTableData(filters, sort, page, pageSize),
    [filters.dateRange, sort.key, sort.direction, page, pageSize]
  );
}
```

---

## 5. `LoadingStates.tsx`

```tsx
// LoadingStates.tsx — Skeleton placeholders for all dashboard sections

import React from "react";

function Skeleton({ className }: { className: string }): React.ReactElement {
  return (
    <div
      className={`animate-pulse bg-zinc-700/50 rounded ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function MetricCardSkeleton(): React.ReactElement {
  return (
    <div className="bg-zinc-800 border border-zinc-700 p-5 rounded">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function ChartSkeleton(): React.ReactElement {
  return (
    <div className="bg-zinc-800 border border-zinc-700 p-5 rounded">
      <Skeleton className="h-5 w-48 mb-2" />
      <Skeleton className="h-3 w-32 mb-6" />
      <div className="flex items-end gap-1 h-48">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton(): React.ReactElement {
  return (
    <div className="bg-zinc-800 border border-zinc-700 p-5 rounded">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): React.ReactElement {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded p-6 text-center">
      <p className="text-red-400 font-medium mb-2">Something went wrong</p>
      <p className="text-red-300/70 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-500 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({
  message = "No data available for the selected filters.",
}: {
  message?: string;
}): React.ReactElement {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 border-dashed rounded p-10 text-center">
      <svg
        className="mx-auto mb-4 text-zinc-600"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
      </svg>
      <p className="text-zinc-400 text-sm">{message}</p>
      <p className="text-zinc-500 text-xs mt-1">Try adjusting your date range or filters.</p>
    </div>
  );
}
```

---

## 6. `MetricCard.tsx`

```tsx
// MetricCard.tsx — Single KPI card with trend indicator and sparkline

import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import type { Metric } from "./types";

function TrendBadge({
  direction,
  percentage,
  isPositive,
}: Metric["trend"]): React.ReactElement {
  const colorClass = isPositive ? "text-emerald-400" : "text-red-400";
  const bgClass = isPositive ? "bg-emerald-400/10" : "bg-red-400/10";
  const arrow = direction === "up" ? "\u2191" : direction === "down" ? "\u2193" : "\u2192";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${colorClass} ${bgClass}`}
    >
      {arrow} {percentage.toFixed(1)}%
    </span>
  );
}

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps): React.ReactElement {
  const sparkData = metric.sparklineData.map((value, index) => ({
    index,
    value,
  }));

  return (
    <article
      className="bg-zinc-800 border border-zinc-700 p-5 rounded group hover:border-zinc-500 transition-colors cursor-default"
      aria-label={`${metric.label}: ${metric.formattedValue}`}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {metric.label}
        </span>
        <TrendBadge {...metric.trend} />
      </div>

      <div className="mb-1">
        <span className="text-2xl font-bold text-zinc-100">
          {metric.formattedValue}
        </span>
      </div>

      <p className="text-xs text-zinc-500 mb-3">
        vs. {metric.formattedPreviousValue} prev. period
      </p>

      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={metric.trend.isPositive ? "#34d399" : "#f87171"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
```

---

## 7. `KPIGrid.tsx`

```tsx
// KPIGrid.tsx — Responsive grid of MetricCard components

import React from "react";
import type { Metric, FilterState } from "./types";
import { MetricCard } from "./MetricCard";
import { MetricCardSkeleton } from "./LoadingStates";
import { ErrorState, EmptyState } from "./LoadingStates";
import { useMetrics } from "./hooks";

interface KPIGridProps {
  filters: FilterState;
}

export function KPIGrid({ filters }: KPIGridProps): React.ReactElement {
  const { data: metrics, isLoading, error, refetch } = useMetrics(filters);

  if (isLoading) {
    return (
      <section aria-label="Key metrics loading">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!metrics || metrics.length === 0) {
    return <EmptyState message="No metrics data available." />;
  }

  return (
    <section aria-label="Key performance indicators">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric: Metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}
```

---

## 8. `TimeSeriesChart.tsx`

```tsx
// TimeSeriesChart.tsx — Line/area chart with optional period comparison

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { FilterState } from "./types";
import { useTimeSeries } from "./hooks";
import { ChartSkeleton, ErrorState, EmptyState } from "./LoadingStates";

interface TimeSeriesChartProps {
  metricKey: string;
  title: string;
  subtitle?: string;
  color: string;
  filters: FilterState;
  valueFormatter?: (value: number) => string;
}

export function TimeSeriesChart({
  metricKey,
  title,
  subtitle,
  color,
  filters,
  valueFormatter = (v) => v.toLocaleString(),
}: TimeSeriesChartProps): React.ReactElement {
  const { data, isLoading, error, refetch } = useTimeSeries(metricKey, filters);

  if (isLoading) return <ChartSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState />;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  return (
    <article className="bg-zinc-800 border border-zinc-700 p-5 rounded">
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        {subtitle && (
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        )}
      </header>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id={`gradient-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              tickFormatter={valueFormatter}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              labelFormatter={formatDate}
              formatter={(value: number, name: string) => [
                valueFormatter(value),
                name === "comparePeriodValue" ? "Previous Period" : "Current",
              ]}
            />
            {filters.comparePreviousPeriod && (
              <Area
                type="monotone"
                dataKey="comparePeriodValue"
                stroke="#6b7280"
                strokeDasharray="4 4"
                fill="transparent"
                strokeWidth={1.5}
                name="comparePeriodValue"
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${metricKey})`}
              strokeWidth={2}
              name="value"
            />
            {filters.comparePreviousPeriod && <Legend />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
```

---

## 9. `BarChart.tsx`

```tsx
// BarChart.tsx — Breakdown bar chart for categorical data

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FilterState } from "./types";
import { useBreakdown } from "./hooks";
import { ChartSkeleton, ErrorState, EmptyState } from "./LoadingStates";

interface BreakdownBarChartProps {
  dimension: string;
  title: string;
  subtitle?: string;
  filters: FilterState;
  valueFormatter?: (value: number) => string;
}

export function BreakdownBarChart({
  dimension,
  title,
  subtitle,
  filters,
  valueFormatter = (v) => `$${v.toLocaleString()}`,
}: BreakdownBarChartProps): React.ReactElement {
  const { data, isLoading, error, refetch } = useBreakdown(dimension, filters);

  if (isLoading) return <ChartSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <article className="bg-zinc-800 border border-zinc-700 p-5 rounded">
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        {subtitle && (
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        )}
      </header>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
            <XAxis
              type="number"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              tickFormatter={valueFormatter}
            />
            <YAxis
              type="category"
              dataKey="label"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [valueFormatter(value), "Revenue"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
```

---

## 10. `FilterBar.tsx`

```tsx
// FilterBar.tsx — Date range, dropdowns, and toggle controls

import React, { useState } from "react";
import type { FilterState } from "./types";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const DATE_RANGES: { label: string; value: FilterState["dateRange"] }[] = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "Custom", value: "custom" },
];

const PLAN_OPTIONS = ["Free", "Pro", "Business"];
const REGION_OPTIONS = ["North America", "Europe", "Asia Pacific", "Latin America"];

export function FilterBar({
  filters,
  onFilterChange,
}: FilterBarProps): React.ReactElement {
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  function setDateRange(range: FilterState["dateRange"]): void {
    onFilterChange({ ...filters, dateRange: range });
  }

  function togglePlan(plan: string): void {
    const current = filters.planTier;
    const next = current.includes(plan)
      ? current.filter((p) => p !== plan)
      : [...current, plan];
    onFilterChange({ ...filters, planTier: next });
  }

  function toggleRegion(region: string): void {
    const current = filters.region;
    const next = current.includes(region)
      ? current.filter((r) => r !== region)
      : [...current, region];
    onFilterChange({ ...filters, region: next });
  }

  function toggleComparePeriod(): void {
    onFilterChange({
      ...filters,
      comparePreviousPeriod: !filters.comparePreviousPeriod,
    });
  }

  function resetFilters(): void {
    onFilterChange({
      dateRange: "30d",
      planTier: [],
      region: [],
      comparePreviousPeriod: false,
    });
  }

  const hasActiveFilters =
    filters.planTier.length > 0 ||
    filters.region.length > 0 ||
    filters.comparePreviousPeriod ||
    filters.dateRange !== "30d";

  return (
    <nav
      className="bg-zinc-800 border border-zinc-700 rounded p-4 flex flex-wrap items-center gap-3"
      aria-label="Dashboard filters"
    >
      {/* Date Range */}
      <div className="flex items-center gap-1 bg-zinc-900 rounded p-1">
        {DATE_RANGES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setDateRange(value)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filters.dateRange === value
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            aria-pressed={filters.dateRange === value}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-zinc-700" aria-hidden="true" />

      {/* Plan Filter */}
      <div className="relative">
        <button
          onClick={() => {
            setIsPlanOpen(!isPlanOpen);
            setIsRegionOpen(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 rounded transition-colors"
          aria-expanded={isPlanOpen}
          aria-haspopup="listbox"
        >
          Plan
          {filters.planTier.length > 0 && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {filters.planTier.length}
            </span>
          )}
        </button>
        {isPlanOpen && (
          <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-10 min-w-[140px]">
            {PLAN_OPTIONS.map((plan) => (
              <label
                key={plan}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.planTier.includes(plan)}
                  onChange={() => togglePlan(plan)}
                  className="rounded border-zinc-600"
                />
                {plan}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Region Filter */}
      <div className="relative">
        <button
          onClick={() => {
            setIsRegionOpen(!isRegionOpen);
            setIsPlanOpen(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 rounded transition-colors"
          aria-expanded={isRegionOpen}
          aria-haspopup="listbox"
        >
          Region
          {filters.region.length > 0 && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {filters.region.length}
            </span>
          )}
        </button>
        {isRegionOpen && (
          <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-10 min-w-[180px]">
            {REGION_OPTIONS.map((region) => (
              <label
                key={region}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.region.includes(region)}
                  onChange={() => toggleRegion(region)}
                  className="rounded border-zinc-600"
                />
                {region}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-zinc-700" aria-hidden="true" />

      {/* Compare Toggle */}
      <button
        onClick={toggleComparePeriod}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
          filters.comparePreviousPeriod
            ? "bg-blue-600/20 text-blue-400 border border-blue-600/50"
            : "text-zinc-400 hover:text-zinc-200 bg-zinc-900"
        }`}
        aria-pressed={filters.comparePreviousPeriod}
      >
        <span
          className={`inline-block w-6 h-3.5 rounded-full relative transition-colors ${
            filters.comparePreviousPeriod ? "bg-blue-600" : "bg-zinc-600"
          }`}
        >
          <span
            className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${
              filters.comparePreviousPeriod ? "left-3" : "left-0.5"
            }`}
          />
        </span>
        Compare prev. period
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Reset filters
        </button>
      )}
    </nav>
  );
}
```

---

## 11. `DataTable.tsx`

```tsx
// DataTable.tsx — Sortable, paginated data table with expandable rows

import React, { useState } from "react";
import type { FilterState, SortConfig, TableRow } from "./types";
import { useTableData } from "./hooks";
import { TableSkeleton, ErrorState, EmptyState } from "./LoadingStates";

interface DataTableProps {
  filters: FilterState;
}

interface Column {
  key: keyof TableRow;
  label: string;
  align: "left" | "right";
  format: (value: unknown) => string;
}

const COLUMNS: Column[] = [
  { key: "name", label: "Segment", align: "left", format: (v) => String(v) },
  { key: "mrr", label: "MRR", align: "right", format: (v) => `$${Number(v).toLocaleString()}` },
  { key: "users", label: "Users", align: "right", format: (v) => Number(v).toLocaleString() },
  { key: "churn", label: "Churn %", align: "right", format: (v) => `${v}%` },
  { key: "arpu", label: "ARPU", align: "right", format: (v) => `$${Number(v).toFixed(2)}` },
  {
    key: "conversion",
    label: "Conversion",
    align: "right",
    format: (v) => `${v}%`,
  },
];

const PAGE_SIZE = 10;

export function DataTable({ filters }: DataTableProps): React.ReactElement {
  const [sort, setSort] = useState<SortConfig>({ key: "mrr", direction: "desc" });
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useTableData(
    filters,
    sort,
    page,
    PAGE_SIZE
  );

  function handleSort(key: string): void {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  }

  function toggleExpand(id: string): void {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.rows.length === 0) return <EmptyState message="No segments match the current filters." />;

  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  return (
    <section className="bg-zinc-800 border border-zinc-700 rounded" aria-label="Segment breakdown table">
      <header className="p-5 border-b border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-100">Segment Breakdown</h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          {data.total} segments &middot; sorted by {sort.key} ({sort.direction})
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 font-medium text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors select-none ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                  onClick={() => handleSort(col.key)}
                  aria-sort={
                    sort.key === col.key
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sort.key === col.key && (
                      <span className="text-blue-400">
                        {sort.direction === "asc" ? "\u2191" : "\u2193"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: TableRow) => (
              <React.Fragment key={row.id}>
                <tr
                  className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(row.id)}
                  aria-expanded={expandedRow === row.id}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3 ${
                        col.align === "right" ? "text-right" : "text-left"
                      } ${col.key === "name" ? "font-medium text-zinc-100" : "text-zinc-300"}`}
                    >
                      {col.format(row[col.key])}
                    </td>
                  ))}
                </tr>
                {expandedRow === row.id && (
                  <tr className="bg-zinc-900/50">
                    <td colSpan={COLUMNS.length} className="px-5 py-4">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-zinc-500">Trend</span>
                          <p className="text-zinc-200 mt-1 font-medium capitalize">
                            {row.trend === "up"
                              ? "\u2191 Growing"
                              : row.trend === "down"
                              ? "\u2193 Declining"
                              : "\u2192 Stable"}
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-500">Revenue Share</span>
                          <p className="text-zinc-200 mt-1 font-medium">
                            {data.rows.reduce((sum: number, r: TableRow) => sum + r.mrr, 0) > 0
                              ? (
                                  (row.mrr /
                                    data.rows.reduce((sum: number, r: TableRow) => sum + r.mrr, 0)) *
                                  100
                                ).toFixed(1)
                              : "0"}
                            %
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-500">User Share</span>
                          <p className="text-zinc-200 mt-1 font-medium">
                            {data.rows.reduce((sum: number, r: TableRow) => sum + r.users, 0) > 0
                              ? (
                                  (row.users /
                                    data.rows.reduce((sum: number, r: TableRow) => sum + r.users, 0)) *
                                  100
                                ).toFixed(1)
                              : "0"}
                            %
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <footer className="flex items-center justify-between px-5 py-3 border-t border-zinc-700">
        <span className="text-xs text-zinc-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
```

---

## 12. `Dashboard.tsx`

```tsx
// Dashboard.tsx — Main dashboard layout
//
// Component Tree:
// Dashboard (layout shell)
// ├── DashboardHeader (title, last-updated, refresh)
// ├── FilterBar (date range, plan/region dropdowns, compare toggle)
// ├── KPIGrid (responsive grid of MetricCard components)
// │   └── MetricCard (value, trend badge, sparkline)
// ├── ChartsSection (responsive grid of chart widgets)
// │   ├── TimeSeriesChart (MRR trend, churn trend)
// │   └── BreakdownBarChart (revenue by plan, revenue by region)
// ├── DataTable (sortable, paginated, expandable rows)
// └── Footer (export hint, last-updated timestamp)
//
// Data Flow:
// - Dashboard owns FilterState via useState
// - FilterBar dispatches changes via onFilterChange callback
// - All data hooks (useMetrics, useTimeSeries, useBreakdown, useTableData)
//   receive filters as a parameter and refetch when filters change
// - Each widget is independent: one widget's error does not crash others

import React, { useState, useCallback } from "react";
import type { FilterState } from "./types";
import { FilterBar } from "./FilterBar";
import { KPIGrid } from "./KPIGrid";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { BreakdownBarChart } from "./BarChart";
import { DataTable } from "./DataTable";

const DEFAULT_FILTERS: FilterState = {
  dateRange: "30d",
  planTier: [],
  region: [],
  comparePreviousPeriod: false,
};

export function Dashboard(): React.ReactElement {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const handleFilterChange = useCallback((next: FilterState) => {
    setFilters(next);
  }, []);

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
    // Force re-render by toggling filters identity
    setFilters((prev) => ({ ...prev }));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Revenue &amp; Growth Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-zinc-800 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
            aria-label="Refresh dashboard data"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* KPI Cards */}
        <KPIGrid filters={filters} />

        {/* Charts Grid */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          aria-label="Charts and visualizations"
        >
          <TimeSeriesChart
            metricKey="mrr"
            title="MRR Trend"
            subtitle="Monthly recurring revenue over 12 months"
            color="#3b82f6"
            filters={filters}
            valueFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <TimeSeriesChart
            metricKey="churn-rate"
            title="Churn Rate Trend"
            subtitle="Monthly churn percentage"
            color="#f87171"
            filters={filters}
            valueFormatter={(v) => `${v}%`}
          />
          <BreakdownBarChart
            dimension="plan"
            title="Revenue by Plan"
            subtitle="MRR breakdown across pricing tiers"
            filters={filters}
            valueFormatter={(v) => `$${v.toLocaleString()}`}
          />
          <BreakdownBarChart
            dimension="region"
            title="Revenue by Region"
            subtitle="Geographic distribution of revenue"
            filters={filters}
            valueFormatter={(v) => `$${v.toLocaleString()}`}
          />
        </section>

        {/* Data Table */}
        <DataTable filters={filters} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-8">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-zinc-500">
          <span>Revenue &amp; Growth Dashboard</span>
          <span>Data refreshed at {lastRefresh.toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
}
```

---

## Usage

Mount the dashboard in your app entry point:

```tsx
import { Dashboard } from "./Dashboard";

function App() {
  return <Dashboard />;
}
```

**Dependencies** (add to `package.json`):

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^19.0.0"
  }
}
```

To switch from mock data to a live API, set `USE_MOCK = false` in `api.ts` and update `BASE_URL` to point to your analytics backend. All hooks and components will work without changes.
