"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2Icon, PaperclipIcon } from "lucide-react"

import { FormField } from "@/components/shared/form-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"
import type { CitizenChallan } from "@/lib/types"

/** Appeal a challan: a written reason plus optional proof (image or PDF, up to 5 MB). */
export function AppealDialog({
  challan,
  open,
  onOpenChange,
  onSubmitted,
}: {
  challan: CitizenChallan
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted: (challan: CitizenChallan) => void
}) {
  const [reason, setReason] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const body = new FormData()
    body.append("reason", reason)
    if (file) body.append("evidence", file)

    setSubmitting(true)
    try {
      const updated = await api.post<CitizenChallan>(`/citizen/challans/${challan.id}/appeal/`, body)
      toast.success("Appeal submitted. You will be notified when it is decided.")
      onSubmitted(updated)
      onOpenChange(false)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors)
        toast.error(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Appeal challan {challan.challan_number}</DialogTitle>
          <DialogDescription>
            Explain why this challan is wrong. While the appeal is under review the challan cannot be paid.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <FormField label="Reason" htmlFor="appeal-reason" error={errors.reason} hint="At least 10 characters.">
            <Textarea
              id="appeal-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder="e.g. My vehicle was in a different city at this time."
              aria-invalid={Boolean(errors.reason) || undefined}
              required
            />
          </FormField>

          <FormField label="Evidence (optional)" htmlFor="appeal-evidence" error={errors.evidence} hint="JPG, PNG, WEBP or PDF, up to 5 MB.">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground hover:bg-muted/50">
              <PaperclipIcon className="size-4" />
              <span className="truncate">{file ? file.name : "Attach a file"}</span>
              <Input
                id="appeal-evidence"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || reason.trim().length < 10}>
              {submitting && <Loader2Icon className="animate-spin" />} Submit appeal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
