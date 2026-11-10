"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AlertTriangleIcon, ArrowLeftIcon, CarIcon, ClockIcon, FlagIcon, Loader2Icon } from "lucide-react"

import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EventCard } from "@/components/video/event-card"
import { ReviewPlayer } from "@/components/video/review-player"
import { useApi } from "@/hooks/use-api"
import { formatClock, formatDateTime } from "@/lib/format"
import type { VideoJobDetail } from "@/lib/types"

const POLL_MS = 2000
const isRunning = (job: VideoJobDetail | null) => !job || job.status === "queued" || job.status === "processing"

export default function VideoJobPage() {
  const { id } = useParams<{ id: string }>()
  const { data: job, loading, refetch } = useApi<VideoJobDetail>(`/video-jobs/${id}/`, undefined, {
    refreshMs: (current) => (isRunning(current) ? POLL_MS : false),
  })
  const player = React.useRef<HTMLVideoElement>(null)

  const seek = (time: number) => {
    const video = player.current
    if (!video) return
    video.currentTime = Math.max(0, time - 1)
    void video.play()
    video.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  if (loading || !job) {
    return (
      <PageContainer>
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 w-full" />
      </PageContainer>
    )
  }

  const events = job.events
  const open = events.filter((e) => e.status === "new").length

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/dashboard/video">
          <ArrowLeftIcon /> All video analyses
        </Link>
      </Button>

      <PageHeader
        title={`Video analysis #${job.id}`}
        description={[job.location, `Uploaded by ${job.uploaded_by_name || "—"}`, formatDateTime(job.created_at)].filter(Boolean).join(" · ")}
        actions={<StatusBadge status={job.status} className="h-7 px-3 text-sm" />}
      />

      {(job.status === "queued" || job.status === "processing") && (
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Loader2Icon className="size-4 animate-spin text-primary" />
              {job.progress < 60 ? "Detecting and tracking vehicles…" : job.progress < 75 ? "Reading number plates…" : "Rendering the review video…"}
              <span className="ml-auto tabular-nums text-muted-foreground">{job.progress}%</span>
            </div>
            <Progress value={job.progress} />
            <p className="text-xs text-muted-foreground">You can leave this page; the analysis continues in the background.</p>
          </CardContent>
        </Card>
      )}

      {job.status === "failed" && (
        <Card className="border-destructive/40">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AlertTriangleIcon className="size-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="font-medium">The analysis failed</p>
              <p className="text-sm text-muted-foreground">{job.error || "Unknown error."}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/video/new">Try another video</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {job.status === "completed" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Video length" value={formatClock(job.duration)} hint={`${job.frames_analysed} frames analysed`} icon={ClockIcon} />
            <StatCard label="Vehicles tracked" value={job.vehicle_count} hint={`${job.tracks.filter((t) => t.plate_number).length} plates read`} icon={CarIcon} tone="success" />
            <StatCard label="Violations found" value={events.length} hint={`${open} waiting for review`} icon={FlagIcon} tone={open ? "warning" : "default"} />
          </div>

          <div className="grid gap-6 xl:grid-cols-5">
            <div className="space-y-6 xl:col-span-3">
              <ReviewPlayer ref={player} src={job.annotated_video ?? job.video} duration={job.duration} events={events} />

              <Card>
                <CardHeader>
                  <CardTitle>Vehicles in this video</CardTitle>
                  <CardDescription>Plates are read from each vehicle&apos;s clearest frames. Always verify against the evidence image.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Plate</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead className="text-right">Seen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {job.tracks.map((track) => (
                        <TableRow key={track.id}>
                          <TableCell className="font-medium">{track.track_id}</TableCell>
                          <TableCell className="capitalize">{track.label}</TableCell>
                          <TableCell>
                            {track.plate_number ? (
                              <span className="flex items-center gap-2">
                                <PlateBadge plate={track.plate_number} />
                                <span className="text-xs text-muted-foreground">{Math.round(track.plate_confidence)}%</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not read</span>
                            )}
                          </TableCell>
                          <TableCell>{track.vehicle_detail?.owner_name ?? "—"}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatClock(track.first_time)}–{formatClock(track.last_time)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {job.tracks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                            No vehicles were detected in this video.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 xl:col-span-2">
              <h2 className="text-lg font-semibold">Detected violations</h2>
              {events.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No violations were detected with the selected settings.
                </div>
              ) : (
                events.map((event) => <EventCard key={event.id} event={event} location={job.location} onSeek={seek} onChange={refetch} />)
              )}
            </div>
          </div>
        </>
      )}
    </PageContainer>
  )
}
