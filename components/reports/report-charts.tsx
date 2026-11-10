"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDay } from "@/lib/format"
import type { ReportSummary } from "@/lib/types"

function ChartCard({ title, description, loading, empty, children }: { title: string; description: string; loading?: boolean; empty?: boolean; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-56 w-full" /> : empty ? <p className="py-20 text-center text-sm text-muted-foreground">No data for this period.</p> : children}
      </CardContent>
    </Card>
  )
}

const dayConfig = { count: { label: "Challans", color: "var(--chart-1)" } } satisfies ChartConfig
const violationConfig = { count: { label: "Challans", color: "var(--chart-2)" } } satisfies ChartConfig
const locationConfig = { count: { label: "Challans", color: "var(--chart-4)" } } satisfies ChartConfig

export function DailyChart({ data, loading }: { data?: ReportSummary["by_day"]; loading?: boolean }) {
  return (
    <ChartCard title="Challans per day" description="Issued in the selected period" loading={loading} empty={!data?.length}>
      <ChartContainer config={dayConfig} className="h-56 w-full">
        <AreaChart data={data} margin={{ left: 0, right: 8 }}>
          <defs>
            <linearGradient id="fillReportDays" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={formatDay} />
          <YAxis width={28} tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => formatDay(String(label))} indicator="line" />} />
          <Area dataKey="count" type="monotone" stroke="var(--color-count)" fill="url(#fillReportDays)" strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

function HorizontalBars({ data, labelKey, config }: { data: { count: number }[]; labelKey: string; config: ChartConfig }) {
  return (
    <ChartContainer config={config} className="h-56 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey={labelKey} type="category" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <XAxis type="number" hide allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export function ViolationBars({ data, loading }: { data?: ReportSummary["by_violation"]; loading?: boolean }) {
  return (
    <ChartCard title="Violations" description="Most frequent offences" loading={loading} empty={!data?.length}>
      <HorizontalBars data={data ?? []} labelKey="name" config={violationConfig} />
    </ChartCard>
  )
}

export function LocationBars({ data, loading }: { data?: ReportSummary["by_location"]; loading?: boolean }) {
  return (
    <ChartCard title="Hotspots" description="Locations with the most challans" loading={loading} empty={!data?.length}>
      <HorizontalBars data={data ?? []} labelKey="location" config={locationConfig} />
    </ChartCard>
  )
}
