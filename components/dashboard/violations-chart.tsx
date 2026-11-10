"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardStats } from "@/lib/types"

const config = { count: { label: "Challans", color: "var(--chart-2)" } } satisfies ChartConfig

export function ViolationsChart({
  data,
  loading,
}: {
  data?: DashboardStats["violations_breakdown"]
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top violations</CardTitle>
        <CardDescription>Most frequent offences</CardDescription>
      </CardHeader>
      <CardContent>
        {loading || !data ? (
          <Skeleton className="h-60 w-full" />
        ) : data.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">No violations recorded yet.</p>
        ) : (
          <ChartContainer config={config} className="h-60 w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <XAxis type="number" hide allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
