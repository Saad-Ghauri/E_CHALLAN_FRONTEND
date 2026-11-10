"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { CheckIcon, ExternalLinkIcon, Loader2Icon, PaperclipIcon, XIcon } from "lucide-react"

import { PlateBadge } from "@/components/shared/plate-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Appeal } from "@/lib/types"

/** Read an appeal and accept (the challan is cancelled) or reject it with a note for the citizen. */
export function AppealReviewDialog({ appeal, onClose, onDecided }: { appeal: Appeal; onClose: () => void; onDecided: () => void }) {
  const [note, setNote] = React.useState("")
  const [busy, setBusy] = React.useState<"accept" | "reject" | null>(null)
  const pending = appeal.status === "pending"

  const decide = async (decision: "accept" | "reject") => {
    setBusy(decision)
    try {
      await api.post(`/appeals/${appeal.id}/decide/`, { decision, note })
      toast.success(decision === "accept" ? "Appeal accepted and challan cancelled." : "Appeal rejected.")
      onDecided()
      onClose()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save the decision.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Appeal on {appeal.challan_number} <StatusBadge status={appeal.status} />
          </DialogTitle>
          <DialogDescription>
            Submitted by {appeal.submitted_by_name || "a citizen"} on {formatDateTime(appeal.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
          <PlateBadge plate={appeal.plate_number} />
          <span className="font-medium tabular-nums">{formatCurrency(appeal.total_fine)}</span>
          <Button asChild variant="link" size="sm" className="ml-auto h-auto p-0">
            <Link href={`/dashboard/challans/${appeal.challan}`} target="_blank">
              Open challan <ExternalLinkIcon />
            </Link>
          </Button>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Citizen&apos;s reason</p>
          <p className="rounded-lg border p-3 text-sm whitespace-pre-wrap">{appeal.reason}</p>
        </div>

        {appeal.evidence && (
          <Button asChild variant="outline" size="sm" className="w-fit">
            <a href={appeal.evidence} target="_blank" rel="noreferrer">
              <PaperclipIcon /> View attached evidence
            </a>
          </Button>
        )}

        {pending ? (
          <>
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Note for the citizen (shown with the decision)" />
            <DialogFooter>
              <Button variant="outline" disabled={busy !== null} onClick={() => decide("reject")}>
                {busy === "reject" ? <Loader2Icon className="animate-spin" /> : <XIcon />} Reject
              </Button>
              <Button disabled={busy !== null} onClick={() => decide("accept")}>
                {busy === "accept" ? <Loader2Icon className="animate-spin" /> : <CheckIcon />} Accept and cancel challan
              </Button>
            </DialogFooter>
          </>
        ) : (
          appeal.decision_note && <p className="text-sm">Decision note: {appeal.decision_note}</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
