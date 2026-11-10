"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { BanIcon, FileTextIcon, Loader2Icon, PlayIcon, Undo2Icon } from "lucide-react"

import { FormDialog, FormField } from "@/components/shared/form-dialog"
import { PlateBadge } from "@/components/shared/plate-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"
import { formatClock, formatCurrency } from "@/lib/format"
import type { Challan, VideoEvent } from "@/lib/types"
import { EVENT_META } from "@/lib/video"
import { cn } from "@/lib/utils"

/** Confirm the plate (it may need correcting) and issue the challan for one event. */
function IssueDialog({ event, location, onClose, onIssued }: { event: VideoEvent; location: string; onClose: () => void; onIssued: () => void }) {
  const [plate, setPlate] = React.useState(event.plate_number)
  const [place, setPlace] = React.useState(location)
  const [notes, setNotes] = React.useState("")
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const challan = await api.post<Challan>(`/video-jobs/events/${event.id}/challan/`, { plate_number: plate, location: place, notes })
      toast.success(`Challan ${challan.challan_number} issued.`)
      onIssued()
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.fieldErrors.plate_number ?? "")
        toast.error(err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Issue challan"
      description={`${event.violation_name} · ${event.fine_amount !== null ? formatCurrency(event.fine_amount) : "fine not set"}`}
      submitLabel="Issue e-challan"
      submitting={busy}
      onSubmit={submit}
    >
      <FormField
        label="Plate number"
        htmlFor="event-plate"
        error={error}
        hint={event.plate_number ? "Read by the system. Check it against the evidence image." : "Could not be read from the video. Type it from the evidence image."}
        className="sm:col-span-2"
      >
        <Input id="event-plate" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} className="font-mono text-base font-bold tracking-wider uppercase" required />
      </FormField>
      <FormField label="Location" htmlFor="event-location" className="sm:col-span-2">
        <Input id="event-location" value={place} onChange={(e) => setPlace(e.target.value)} />
      </FormField>
      <FormField label="Notes (optional)" htmlFor="event-notes" className="sm:col-span-2">
        <Textarea id="event-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </FormField>
    </FormDialog>
  )
}

export function EventCard({
  event,
  location,
  onSeek,
  onChange,
}: {
  event: VideoEvent
  location: string
  onSeek: (time: number) => void
  onChange: () => void
}) {
  const meta = EVENT_META[event.event_type]
  const Icon = meta.icon
  const [issuing, setIssuing] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  const setStatus = async (status: "dismissed" | "new") => {
    setBusy(true)
    try {
      await api.patch(`/video-jobs/events/${event.id}/`, { status })
      onChange()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update the event.")
    } finally {
      setBusy(false)
    }
  }

  const dismissed = event.status === "dismissed"

  return (
    <article className={cn("overflow-hidden rounded-xl border bg-card", dismissed && "opacity-60")}>
      <button type="button" onClick={() => onSeek(event.time_sec)} className="group relative block w-full" aria-label={`Play ${meta.label} at ${formatClock(event.time_sec)}`}>
        {event.snapshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.snapshot} alt={`${meta.label} evidence`} className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted text-sm text-muted-foreground">No snapshot</div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <PlayIcon className="size-8" />
        </span>
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">{formatClock(event.time_sec)}</span>
      </button>

      <div className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn("gap-1", meta.chip)}>
            <Icon /> {meta.label}
          </Badge>
          <StatusBadge status={event.status} />
          <span className="ml-auto text-xs text-muted-foreground">{Math.round(event.confidence * 100)}% sure</span>
        </div>

        <p className="text-sm text-muted-foreground">{event.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs text-muted-foreground capitalize">Vehicle #{event.track_number} · {event.vehicle_label}</span>
          {event.plate_number ? <PlateBadge plate={event.plate_number} /> : <Badge variant="outline">Plate unreadable</Badge>}
        </div>
        {event.vehicle_detail && (
          <p className="text-xs text-muted-foreground">
            Owner: <span className="font-medium text-foreground">{event.vehicle_detail.owner_name}</span>
            {event.vehicle_detail.is_blacklisted && <span className="ml-1 font-semibold text-destructive">· Blacklisted</span>}
          </p>
        )}

        {event.status === "challan_issued" && event.challan_id ? (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/dashboard/challans/${event.challan_id}`}>
              <FileTextIcon /> Open challan
            </Link>
          </Button>
        ) : (
          <div className="flex gap-2">
            {!dismissed && (
              <Button size="sm" className="flex-1" onClick={() => setIssuing(true)}>
                <FileTextIcon /> Issue challan
              </Button>
            )}
            <Button variant="outline" size="sm" className={dismissed ? "flex-1" : undefined} disabled={busy} onClick={() => setStatus(dismissed ? "new" : "dismissed")}>
              {busy ? <Loader2Icon className="animate-spin" /> : dismissed ? <Undo2Icon /> : <BanIcon />}
              {dismissed ? "Restore" : "Dismiss"}
            </Button>
          </div>
        )}
      </div>

      {issuing && <IssueDialog event={event} location={location} onClose={() => setIssuing(false)} onIssued={onChange} />}
    </article>
  )
}
