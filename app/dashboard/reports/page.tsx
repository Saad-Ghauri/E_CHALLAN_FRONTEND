"use client"

import * as React from "react"
import { toast } from "sonner"
import { BanknoteIcon, FileDownIcon, FileTextIcon, Loader2Icon, PercentIcon, WalletIcon } from "lucide-react"

import { DailyChart, LocationBars, ViolationBars } from "@/components/reports/report-charts"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApi } from "@/hooks/use-api"
import { downloadFile } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import type { ReportSummary } from "@/lib/types"

const iso = (date: Date) => date.toISOString().slice(0, 10)
const daysAgo = (n: number) => iso(new Date(Date.now() - n * 864e5))

const PRESETS = [
  { label: "Last 7 days", from: () => daysAgo(7) },
  { label: "Last 30 days", from: () => daysAgo(30) },
  { label: "This year", from: () => `${new Date().getFullYear()}-01-01` },
  { label: "All time", from: () => "" },
]

export default function ReportsPage() {
  const [from, setFrom] = React.useState("")
  const [to, setTo] = React.useState("")
  const [exporting, setExporting] = React.useState(false)
  const range = { issued_from: from, issued_to: to }
  const { data, loading } = useApi<ReportSummary>("/dashboard/reports/summary/", range)
  const totals = data?.totals

  const exportCsv = async () => {
    setExporting(true)
    try {
      await downloadFile("/dashboard/reports/challans.csv", "challans.csv", range)
    } catch {
      toast.error("Could not export the report.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Challan statistics for any period, ready to export."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={exporting}>
            {exporting ? <Loader2Icon className="animate-spin" /> : <FileDownIcon />} Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 lg:flex-row lg:items-end">
        <div className="grid gap-3 sm:grid-cols-2 lg:w-96">
          <div className="space-y-1.5">
            <Label htmlFor="from">From</Label>
            <Input id="from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} max={to || undefined} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">To</Label>
            <Input id="to" type="date" value={to} onChange={(event) => setTo(event.target.value)} min={from || undefined} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setFrom(preset.from())
                setTo("")
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Challans" value={totals?.challans ?? 0} hint={`${totals?.cancelled ?? 0} cancelled`} icon={FileTextIcon} loading={loading} />
        <StatCard label="Total fines" value={formatCurrency(totals?.total_fines ?? 0)} hint="Excluding cancelled" icon={WalletIcon} loading={loading} />
        <StatCard label="Collected" value={formatCurrency(totals?.collected ?? 0)} hint={`${formatCurrency(totals?.outstanding ?? 0)} outstanding`} icon={BanknoteIcon} tone="success" loading={loading} />
        <StatCard label="Collection rate" value={`${totals?.collection_rate ?? 0}%`} hint="Collected / total fines" icon={PercentIcon} tone="warning" loading={loading} />
      </div>

      <DailyChart data={data?.by_day} loading={loading} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ViolationBars data={data?.by_violation} loading={loading} />
        <LocationBars data={data?.by_location} loading={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By officer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Officer</TableHead>
                <TableHead className="text-right">Challans</TableHead>
                <TableHead className="text-right">Fines issued</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.by_officer ?? []).map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(row.amount)}</TableCell>
                </TableRow>
              ))}
              {!loading && !data?.by_officer.length && (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                    No data for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
