"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDay } from "@/lib/format"
import type { DashboardStats } from "@/lib/types"

const config = { challans: { label: "Challans", color: "var(--chart-1)" } } satisfies ChartConfig

export function TrendChart({ trend, loading }: { trend?: DashboardStats["trend"]; loading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Challans issued</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading || !trend ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <ChartContainer config={config} className="h-60 w-full">
            <AreaChart data={trend} margin={{ left: 0, right: 8 }}>
              <defs>
                <linearGradient id="fillChallans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-challans)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-challans)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={formatDay} />
              <YAxis width={28} tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => formatDay(String(label))} indicator="line" />} />
              <Area dataKey="challans" type="monotone" stroke="var(--color-challans)" fill="url(#fillChallans)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
