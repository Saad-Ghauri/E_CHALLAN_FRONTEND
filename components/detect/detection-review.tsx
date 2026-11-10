"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangleIcon, CheckCircle2Icon, FileTextIcon, Loader2Icon, SaveIcon } from "lucide-react"

import { VehicleSummary } from "@/components/detect/vehicle-summary"
import { ViolationPicker } from "@/components/detect/violation-picker"
import { FormField } from "@/components/shared/form-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { formatPlate } from "@/lib/format"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useViolationTypes } from "@/hooks/use-violation-types"
import { api, ApiError } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import type { Challan, Detection } from "@/lib/types"

/**
 * Review one detection: verify/correct the plate, confirm the matched vehicle,
 * choose violations and issue the challan.
 *
 * Render with `key={detection.id + plate}` so local state resets when the
 * plate is corrected and new violation suggestions arrive.
 */
export function DetectionReview({
  detection,
  onChange,
}: {
  detection: Detection
  onChange: (detection: Detection) => void
}) {
  const router = useRouter()
  const { violationTypes, loading: typesLoading } = useViolationTypes()

  const suggestedIds = React.useMemo(
    () => new Set(detection.suggested_violations.map((type) => type.id)),
    [detection.suggested_violations]
  )
  const [plate, setPlate] = React.useState(detection.plate_number)
  const [location, setLocation] = React.useState(detection.location)
  const [notes, setNotes] = React.useState("")
  const [selected, setSelected] = React.useState(() => new Set(suggestedIds))
  const [saving, setSaving] = React.useState(false)
  const [issuing, setIssuing] = React.useState(false)

  const total = violationTypes.filter((type) => selected.has(type.id)).reduce((sum, type) => sum + type.fine_amount, 0)
  const plateChanged = plate.trim() !== detection.plate_number || location !== detection.location

  const toggle = (id: number) =>
    setSelected((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const run = async (setBusy: (busy: boolean) => void, action: () => Promise<void>) => {
    setBusy(true)
    try {
      await action()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }

  const savePlate = () =>
    run(setSaving, async () => {
      const updated = await api.patch<Detection>(`/detections/${detection.id}/`, { plate_number: plate, location })
      onChange(updated)
      toast.success("Plate verified and vehicle record refreshed.")
    })

  const issueChallan = () =>
    run(setIssuing, async () => {
      const challan = await api.post<Challan>("/challans/", {
        detection: detection.id,
        plate_number: plate,
        location,
        notes,
        violation_types: [...selected],
      })
      toast.success(`Challan ${challan.challan_number} issued.`)
      router.push(`/dashboard/challans/${challan.id}`)
    })

  const needsAttention = detection.status !== "completed"

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Evidence */}
      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border bg-muted">
          {detection.annotated_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={detection.annotated_image} alt="Annotated detection evidence" className="w-full object-contain" />
          ) : (
            <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
              No annotated preview available
            </div>
          )}
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center text-sm">
          {[
            ["Status", <StatusBadge key="s" status={detection.status} />],
            ["OCR confidence", `${detection.confidence.toFixed(0)}%`],
            ["Vehicle class", detection.vehicle_label || "n/a"],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border p-2">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 flex justify-center font-medium capitalize">{value}</dd>
            </div>
          ))}
        </dl>
        {detection.error && (
          <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" /> {detection.error}
          </p>
        )}
      </div>

      {/* Verification + challan */}
      <div className="space-y-5">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">1 · Verify plate number</h3>
          <div className="flex gap-2">
            <Input
              value={plate}
              onChange={(event) => setPlate(formatPlate(event.target.value))}
              placeholder="e.g. LEA-1234"
              className="h-9 font-mono text-base font-bold tracking-wider uppercase"
              aria-label="Plate number"
            />
            <Button variant="outline" className="h-9" disabled={saving || !plateChanged || !plate.trim()} onClick={savePlate}>
              {saving ? <Loader2Icon className="animate-spin" /> : <SaveIcon />} Verify
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {detection.raw_text ? `OCR read “${detection.raw_text}”. ` : ""}
            {needsAttention ? "Please check the plate against the image and correct it if needed." : "Plate format is valid."}
          </p>
          <VehicleSummary vehicle={detection.vehicle_detail} hasPlate={Boolean(detection.plate_number)} />
        </section>

        {detection.challan_id ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2Icon className="size-4 text-emerald-500" /> A challan has already been issued for this detection.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/challans/${detection.challan_id}`}>
                <FileTextIcon /> Open challan
              </Link>
            </Button>
          </div>
        ) : (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">2 · Violations</h3>
            <ViolationPicker
              options={violationTypes}
              selected={selected}
              onToggle={toggle}
              suggestedIds={suggestedIds}
              loading={typesLoading}
            />
            <FormField label="Location" htmlFor="location">
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mall Road, near Liberty" />
            </FormField>
            <FormField label="Notes (optional)" htmlFor="notes">
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </FormField>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Total fine</p>
                <p className="text-xl font-semibold tabular-nums">{formatCurrency(total)}</p>
              </div>
              <Button
                size="lg"
                disabled={issuing || plateChanged || selected.size === 0 || !plate.trim()}
                onClick={issueChallan}
              >
                {issuing ? <Loader2Icon className="animate-spin" /> : <FileTextIcon />} Issue e-challan
              </Button>
            </div>
            {plateChanged && (
              <p className="text-xs text-amber-600 dark:text-amber-400">Verify the edited plate before issuing the challan.</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
