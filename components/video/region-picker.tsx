"use client"

import * as React from "react"
import { EraserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { FlowDirection } from "@/lib/types"

type Zone = [number, number, number, number] | null

const ARROWS: Record<FlowDirection, string> = { down: "↓", up: "↑", left: "←", right: "→" }

/**
 * Shows a frame of the selected video so the officer can draw the no-parking zone (drag on the picture)
 * and place the stop line (slider). Everything is stored as 0-1 fractions of the frame.
 */
export function RegionPicker({
  file,
  flow,
  drawZone,
  zone,
  onZoneChange,
  showStopLine,
  stopLine,
  onStopLineChange,
}: {
  file: File
  flow: FlowDirection
  drawZone: boolean
  zone: Zone
  onZoneChange: (zone: Zone) => void
  showStopLine: boolean
  stopLine: number
  onStopLineChange: (value: number) => void
}) {
  const [url, setUrl] = React.useState<string | null>(null)
  const [draft, setDraft] = React.useState<Zone>(null)
  const overlay = React.useRef<HTMLDivElement>(null)
  const start = React.useRef<[number, number] | null>(null)

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const point = (event: React.PointerEvent): [number, number] => {
    const box = overlay.current!.getBoundingClientRect()
    const clamp = (v: number) => Math.min(1, Math.max(0, v))
    return [clamp((event.clientX - box.left) / box.width), clamp((event.clientY - box.top) / box.height)]
  }
  const rect = (a: [number, number], b: [number, number]): Zone => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])]

  const shown = draft ?? zone
  const horizontal = flow === "down" || flow === "up"

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border bg-black">
        <video
          src={url ?? undefined}
          muted
          playsInline
          preload="auto"
          className="block w-full"
          onLoadedMetadata={(event) => {
            event.currentTarget.currentTime = Math.min(0.5, event.currentTarget.duration / 2)
          }}
        />
        <div
          ref={overlay}
          className={drawZone ? "absolute inset-0 cursor-crosshair touch-none" : "absolute inset-0"}
          onPointerDown={(event) => {
            if (!drawZone) return
            event.currentTarget.setPointerCapture(event.pointerId)
            start.current = point(event)
            setDraft(null)
          }}
          onPointerMove={(event) => {
            if (start.current) setDraft(rect(start.current, point(event)))
          }}
          onPointerUp={(event) => {
            if (!start.current) return
            const finished = rect(start.current, point(event))
            start.current = null
            setDraft(null)
            if (finished && finished[2] - finished[0] > 0.03 && finished[3] - finished[1] > 0.03) onZoneChange(finished)
          }}
        >
          {drawZone && shown && (
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/25"
              style={{ left: `${shown[0] * 100}%`, top: `${shown[1] * 100}%`, width: `${(shown[2] - shown[0]) * 100}%`, height: `${(shown[3] - shown[1]) * 100}%` }}
            >
              <span className="absolute -top-0.5 left-0 -translate-y-full rounded-t bg-amber-400 px-1.5 text-[11px] font-semibold text-black">No parking</span>
            </div>
          )}
          {showStopLine && (
            <div
              className="absolute border-red-500 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
              style={
                horizontal
                  ? { left: 0, right: 0, top: `${stopLine * 100}%`, borderTopWidth: 3, borderStyle: "dashed" }
                  : { top: 0, bottom: 0, left: `${stopLine * 100}%`, borderLeftWidth: 3, borderStyle: "dashed" }
              }
            >
              <span className="absolute -top-5 left-1 rounded bg-red-500 px-1.5 text-[11px] font-semibold text-white">Stop line</span>
            </div>
          )}
          <span className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Traffic flow {ARROWS[flow]}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {drawZone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            {zone ? "No-parking zone set." : "Drag on the picture to mark the no-parking zone (optional)."}
            {zone && (
              <Button type="button" variant="ghost" size="xs" onClick={() => onZoneChange(null)}>
                <EraserIcon /> Clear
              </Button>
            )}
          </div>
        )}
        {showStopLine && (
          <label className="flex flex-1 items-center gap-3 text-muted-foreground">
            Stop line
            <input
              type="range"
              min={5}
              max={95}
              value={Math.round(stopLine * 100)}
              onChange={(event) => onStopLineChange(Number(event.target.value) / 100)}
              className="min-w-40 flex-1 accent-red-500"
              aria-label="Stop line position"
            />
          </label>
        )}
      </div>
    </div>
  )
}
