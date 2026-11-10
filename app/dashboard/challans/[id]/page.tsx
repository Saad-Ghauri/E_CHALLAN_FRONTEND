"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeftIcon, BanIcon, BanknoteIcon, DownloadIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { ConfirmDialog } from "@/components/shared/form-dialog"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/hooks/use-api"
import { api, ApiError } from "@/lib/api"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format"
import type { Challan } from "@/lib/types"

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children || "—"}</dd>
    </div>
  )
}

export default function ChallanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAdmin } = useAuth()
  const { data: challan, loading, setData } = useApi<Challan>(`/challans/${id}/`)
  const [payOpen, setPayOpen] = React.useState(false)
  const [cancelOpen, setCancelOpen] = React.useState(false)
  const [reference, setReference] = React.useState("")
  const [reason, setReason] = React.useState("")

  const act = (path: string, body: object, success: string) => async () => {
    try {
      setData(await api.post<Challan>(`/challans/${id}/${path}/`, body))
      toast.success(success)
    } catch (err) {
      toast.error(err instanceof ApiError ? (err.fieldErrors.reason ?? err.message) : "Action failed.")
      throw err
    }
  }

  const downloadPdf = async () => {
    try {
      const url = await api.blobUrl(`/challans/${id}/pdf/`)
      const link = Object.assign(document.createElement("a"), { href: url, download: `${challan?.challan_number}.pdf` })
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error("Could not generate the PDF.")
    }
  }

  if (loading || !challan) {
    return (
      <PageContainer>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </PageContainer>
    )
  }

  const unpaid = challan.status === "unpaid"

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/dashboard/challans">
          <ArrowLeftIcon /> All challans
        </Link>
      </Button>

      <PageHeader
        title={challan.challan_number}
        description={`Issued ${formatDateTime(challan.issued_at)} by ${challan.issued_by_name || "system"}`}
        actions={
          <>
            <StatusBadge status={challanStatus(challan)} className="h-7 px-3 text-sm" />
            <Button variant="outline" onClick={downloadPdf}>
              <DownloadIcon /> PDF
            </Button>
            {unpaid && (
              <Button onClick={() => setPayOpen(true)}>
                <BanknoteIcon /> Mark as paid
              </Button>
            )}
            {unpaid && isAdmin && (
              <Button variant="destructive" onClick={() => setCancelOpen(true)}>
                <BanIcon /> Cancel
              </Button>
            )}
          </>
        }
      />

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
                <span>Total payable</span>
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
              <Detail label="Owner">{challan.vehicle_detail?.owner_name ?? "Unregistered vehicle"}</Detail>
              <Detail label="Vehicle">
                {[challan.vehicle_detail?.make, challan.vehicle_detail?.model].filter(Boolean).join(" ")}
              </Detail>
              <Detail label="Location">{challan.location}</Detail>
              <Detail label="Due date">{formatDate(challan.due_date)}</Detail>
              {challan.paid_at && (
                <Detail label="Paid">
                  {formatDateTime(challan.paid_at)}
                  {challan.payment_reference && ` · Ref ${challan.payment_reference}`}
                </Detail>
              )}
              {challan.cancel_reason && <Detail label="Cancelled because">{challan.cancel_reason}</Detail>}
              <Detail label="Notes">{challan.notes}</Detail>
            </dl>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        title="Record payment"
        description={`Confirm that ${formatCurrency(challan.total_fine)} has been received for this challan.`}
        confirmLabel="Mark as paid"
        onConfirm={act("pay", { payment_reference: reference }, "Challan marked as paid.")}
      >
        <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Payment reference (optional)" />
      </ConfirmDialog>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel challan"
        description="This cannot be undone. Provide the reason for the record."
        confirmLabel="Cancel challan"
        destructive
        onConfirm={act("cancel", { reason }, "Challan cancelled.")}
      >
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (required)" />
      </ConfirmDialog>
    </PageContainer>
  )
}
