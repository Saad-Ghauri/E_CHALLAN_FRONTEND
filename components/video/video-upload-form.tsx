"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2Icon, ScanSearchIcon } from "lucide-react"

import { UploadZone, VIDEO_ACCEPT } from "@/components/detect/upload-zone"
import { RegionPicker } from "@/components/video/region-picker"
import { FormField } from "@/components/shared/form-dialog"
import { SelectField } from "@/components/shared/select-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { api, ApiError } from "@/lib/api"
import type { FlowDirection, VideoConfig, VideoJob } from "@/lib/types"
import { DEFAULT_VIDEO_CONFIG, EVENT_META, FLOW_OPTIONS } from "@/lib/video"
import { cn } from "@/lib/utils"

function Detector({
  type,
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  type: keyof typeof EVENT_META
  title: string
  description: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children?: React.ReactNode
}) {
  const { icon: Icon, chip } = EVENT_META[type]
  return (
    <div className={cn("rounded-xl border p-4 transition-colors", enabled ? "bg-card" : "bg-muted/30")}>
      <div className="flex items-start gap-3">
        <span className={cn("rounded-lg p-2", chip)}>
          <Icon className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} aria-label={`Detect ${title.toLowerCase()}`} />
      </div>
      {enabled && children && <div className="mt-3 grid gap-3 border-t pt-3">{children}</div>}
    </div>
  )
}

/** Upload a video, choose which violations to look for, and start the analysis. */
export function VideoUploadForm() {
  const router = useRouter()
  const [file, setFile] = React.useState<File | null>(null)
  const [location, setLocation] = React.useState("")
  const [config, setConfig] = React.useState<VideoConfig>(DEFAULT_VIDEO_CONFIG)
  const [submitting, setSubmitting] = React.useState(false)

  const patch = <K extends keyof VideoConfig>(key: K, value: Partial<VideoConfig[K]>) =>
    setConfig((current) => ({ ...current, [key]: { ...current[key], ...value } }))
  const anything = Object.values(config).some((section) => section.enabled)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) return
    const body = new FormData()
    body.append("video", file)
    body.append("location", location)
    body.append("config", JSON.stringify(config))

    setSubmitting(true)
    try {
      const job = await api.post<VideoJob>("/video-jobs/", body)
      toast.success("Video uploaded. Analysis has started.")
      router.push(`/dashboard/video/${job.id}`)
    } catch (err) {
      toast.error(err instanceof ApiError ? (err.fieldErrors.video ?? err.fieldErrors.config ?? err.message) : "Upload failed.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>1 · Video</CardTitle>
            <CardDescription>A fixed camera over a road works best. Up to 2 minutes are analysed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadZone
              file={file}
              onFile={setFile}
              disabled={submitting}
              accept={VIDEO_ACCEPT}
              title="Drop a traffic video here, or click to browse"
              hint="MP4, AVI, MOV, MKV, WEBM · up to 200 MB"
            />
            <FormField label="Location (optional)" htmlFor="video-location">
              <Input id="video-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Canal Road, Lahore" disabled={submitting} />
            </FormField>
            {file && (config.illegal_parking.enabled || config.red_light.enabled) && (
              <RegionPicker
                file={file}
                flow={config.wrong_way.direction}
                drawZone={config.illegal_parking.enabled}
                zone={config.illegal_parking.zone}
                onZoneChange={(zone) => patch("illegal_parking", { zone })}
                showStopLine={config.red_light.enabled}
                stopLine={config.red_light.stop_line}
                onStopLineChange={(stop_line) => patch("red_light", { stop_line })}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>2 · What to look for</CardTitle>
            <CardDescription>Vehicles are always tracked and their plates read.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField label="Direction of normal traffic" htmlFor="flow">
              <SelectField id="flow" value={config.wrong_way.direction} onChange={(value) => patch("wrong_way", { direction: value as FlowDirection })} options={FLOW_OPTIONS} />
            </FormField>

            <Detector type="wrong_way" title="Wrong-way driving" description="Moving against the direction above." enabled={config.wrong_way.enabled} onToggle={(enabled) => patch("wrong_way", { enabled })} />

            <Detector type="illegal_parking" title="Illegal parking" description="Standing still too long (inside the zone, if drawn)." enabled={config.illegal_parking.enabled} onToggle={(enabled) => patch("illegal_parking", { enabled })}>
              <FormField label="Seconds before it counts" htmlFor="parking-seconds">
                <Input
                  id="parking-seconds"
                  type="number"
                  min={2}
                  max={120}
                  value={config.illegal_parking.seconds}
                  onChange={(event) => patch("illegal_parking", { seconds: Number(event.target.value) })}
                />
              </FormField>
            </Detector>

            <Detector type="triple_riding" title="Triple riding" description="Three or more people on one motorcycle." enabled={config.triple_riding.enabled} onToggle={(enabled) => patch("triple_riding", { enabled })} />

            <Detector type="red_light" title="Red-light running" description="Crossing the stop line while the signal is red. Needs the traffic light in view." enabled={config.red_light.enabled} onToggle={(enabled) => patch("red_light", { enabled })}>
              <p className="text-xs text-muted-foreground">Move the stop line on the picture to where vehicles must stop.</p>
            </Detector>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={!file || !anything || submitting}>
          {submitting ? <Loader2Icon className="animate-spin" /> : <ScanSearchIcon />} Start analysis
        </Button>
        {!anything && <p className="text-center text-xs text-destructive">Turn on at least one detector.</p>}
      </div>
    </form>
  )
}
