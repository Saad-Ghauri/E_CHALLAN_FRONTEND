"use client"

import * as React from "react"

import { formatClock } from "@/lib/format"
import type { VideoEvent } from "@/lib/types"
import { EVENT_META } from "@/lib/video"
import { cn } from "@/lib/utils"

/** The annotated video with a timeline underneath: one coloured marker per detected event (click to jump there). */
export const ReviewPlayer = React.forwardRef<HTMLVideoElement, { src: string; duration: number; events: VideoEvent[] }>(
  function ReviewPlayer({ src, duration, events }, ref) {
    const inner = React.useRef<HTMLVideoElement>(null)
    React.useImperativeHandle(ref, () => inner.current!)
    const [current, setCurrent] = React.useState(0)
    const [total, setTotal] = React.useState(duration)

    const seek = (time: number) => {
      const video = inner.current
      if (!video) return
      video.currentTime = Math.max(0, time - 1)
      void video.play()
    }

    return (
      <div className="space-y-2">
        <video
          ref={inner}
          src={src}
          controls
          preload="metadata"
          className="aspect-video w-full rounded-xl border bg-black"
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setTotal(event.currentTarget.duration || duration)}
        />
        <div className="relative h-6 rounded-full bg-muted" role="group" aria-label="Detected events timeline">
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary/20" style={{ width: `${Math.min(100, (current / Math.max(total, 1)) * 100)}%` }} />
          {events.map((event) => {
            const meta = EVENT_META[event.event_type]
            return (
              <button
                key={event.id}
                type="button"
                title={`${meta.label} at ${formatClock(event.time_sec)}`}
                aria-label={`${meta.label} at ${formatClock(event.time_sec)}`}
                onClick={() => seek(event.time_sec)}
                className={cn(
                  "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background transition-transform hover:scale-125",
                  meta.dot,
                  event.status === "dismissed" && "opacity-40"
                )}
                style={{ left: `${Math.min(98, Math.max(2, (event.time_sec / Math.max(total, 1)) * 100))}%` }}
              />
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatClock(current)} / {formatClock(total)} · The coloured dots on the timeline are detected events.
        </p>
      </div>
    )
  }
)
