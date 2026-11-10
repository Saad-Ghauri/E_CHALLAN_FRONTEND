"use client"

import Link from "next/link"
import { AlertTriangleIcon, CarIcon, ClockIcon, FileTextIcon, WalletIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/hooks/use-api"
import { formatCurrency, formatDate } from "@/lib/format"
import type { CitizenChallan, CitizenSummary, Paginated } from "@/lib/types"

export default function CitizenHomePage() {
  const { user } = useAuth()
  const summary = useApi<CitizenSummary>("/citizen/summary/")
  const unpaid = useApi<Paginated<CitizenChallan>>("/citizen/challans/", { status: "unpaid", page_size: 5 })
  const s = summary.data
  const noVehicles = s !== null && s.vehicles === 0

  return (
    <>
      <PageHeader title={`Hello, ${user?.first_name || "there"}`} description="Your vehicles, challans and appeals in one place." />

      {noVehicles && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CarIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Add your vehicle to see its challans</p>
                <p className="text-sm text-muted-foreground">Enter your number plate and CNIC once, and any challan issued to it shows up here.</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/citizen/vehicles">Add a vehicle</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Amount due" value={formatCurrency(s?.unpaid_amount ?? 0)} hint={`${s?.unpaid_count ?? 0} unpaid challans`} icon={WalletIcon} tone="warning" loading={summary.loading} />
        <StatCard label="Overdue" value={s?.overdue_count ?? 0} hint="Past the due date" icon={AlertTriangleIcon} tone="danger" loading={summary.loading} />
        <StatCard label="Paid" value={s?.paid_count ?? 0} hint="Settled challans" icon={FileTextIcon} tone="success" loading={summary.loading} />
        <StatCard label="Pending appeals" value={s?.pending_appeals ?? 0} hint={`${s?.vehicles ?? 0} vehicle(s) linked`} icon={ClockIcon} loading={summary.loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs your attention</CardTitle>
          <CardDescription>Unpaid challans, newest first</CardDescription>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href="/citizen/challans">All challans</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {unpaid.loading ? (
            <Skeleton className="h-24 w-full" />
          ) : unpaid.data?.results.length ? (
            <ul className="divide-y">
              {unpaid.data.results.map((challan) => (
                <li key={challan.id}>
                  <Link href={`/citizen/challans/${challan.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-muted/40 sm:px-2">
                    <PlateBadge plate={challan.plate_number} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{challan.items.map((item) => item.name).join(", ")}</p>
                      <p className="text-xs text-muted-foreground">Due {formatDate(challan.due_date)}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatCurrency(challan.total_fine)}</span>
                    <StatusBadge status={challanStatus(challan)} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing to pay. You&apos;re all clear.</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
