"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeftIcon, CreditCardIcon, DownloadIcon, GavelIcon, Loader2Icon } from "lucide-react"

import { AppealDialog } from "@/components/citizen/appeal-dialog"
import { PayDialog } from "@/components/citizen/pay-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/hooks/use-api"
import { downloadFile } from "@/lib/api"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format"
import type { CitizenChallan } from "@/lib/types"

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children || "—"}</dd>
    </div>
  )
}

export default function CitizenChallanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: challan, loading, setData } = useApi<CitizenChallan>(`/citizen/challans/${id}/`)
  const [payOpen, setPayOpen] = React.useState(false)
  const [appealOpen, setAppealOpen] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)

  if (loading || !challan) {
    return (
      <>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </>
    )
  }

  const pdf = async () => {
    setDownloading(true)
    try {
      await downloadFile(`/citizen/challans/${challan.id}/pdf/`, `${challan.challan_number}.pdf`)
    } catch {
      toast.error("Could not download the PDF.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/citizen/challans">
          <ArrowLeftIcon /> My challans
        </Link>
      </Button>

      <PageHeader
        title={challan.challan_number}
        description={`Issued ${formatDateTime(challan.issued_at)}`}
        actions={
          <>
            <StatusBadge status={challanStatus(challan)} className="h-7 px-3 text-sm" />
            <Button variant="outline" onClick={pdf} disabled={downloading}>
              {downloading ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />} PDF
            </Button>
            {challan.can_appeal && (
              <Button variant="outline" onClick={() => setAppealOpen(true)}>
                <GavelIcon /> Appeal
              </Button>
            )}
            {challan.can_pay && (
              <Button onClick={() => setPayOpen(true)}>
                <CreditCardIcon /> Pay {formatCurrency(challan.total_fine)}
              </Button>
            )}
          </>
        }
      />

      {challan.appeal && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">Your appeal</p>
            <StatusBadge status={challan.appeal.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">“{challan.appeal.reason}”</p>
          {challan.appeal.status === "pending" && (
            <p className="mt-2 text-sm">An administrator is reviewing it. The challan cannot be paid until it is decided.</p>
          )}
          {challan.appeal.decision_note && <p className="mt-2 text-sm">Decision note: {challan.appeal.decision_note}</p>}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Violations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="divide-y rounded-lg border">
              {challan.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-3 text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium tabular-nums">{formatCurrency(item.fine_amount)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between bg-muted/50 p-3 font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(challan.total_fine)}</span>
              </li>
            </ul>
            {challan.evidence_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={challan.evidence_image} alt="Evidence" className="w-full rounded-xl border object-contain" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <Detail label="Plate">
                <PlateBadge plate={challan.plate_number} />
              </Detail>
              <Detail label="Location">{challan.location}</Detail>
              <Detail label="Due date">{formatDate(challan.due_date)}</Detail>
              {challan.paid_at && (
                <Detail label="Paid">
                  {formatDateTime(challan.paid_at)}
                  <span className="block text-xs font-normal text-muted-foreground">Receipt {challan.payment_reference}</span>
                </Detail>
              )}
              {challan.cancel_reason && <Detail label="Cancelled because">{challan.cancel_reason}</Detail>}
            </dl>
          </CardContent>
        </Card>
      </div>

      <PayDialog challan={challan} open={payOpen} onOpenChange={setPayOpen} onPaid={setData} />
      <AppealDialog challan={challan} open={appealOpen} onOpenChange={setAppealOpen} onSubmitted={setData} />
    </>
  )
}
