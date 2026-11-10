"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FilmIcon, PlusIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { DataTable, type Column } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/form-dialog"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { RowActions } from "@/components/shared/row-actions"
import { StatusBadge } from "@/components/shared/status-badge"
import { FilterTabs, SearchInput, Toolbar } from "@/components/shared/toolbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useList } from "@/hooks/use-list"
import { api, ApiError } from "@/lib/api"
import { formatClock, formatDateTime } from "@/lib/format"
import type { VideoJob } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
]

export default function VideoJobsPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const list = useList<VideoJob>("/video-jobs/", { status: "all" })
  const [deleting, setDeleting] = React.useState<VideoJob | null>(null)

  // Refresh the list while any job is still running.
  const running = list.items.some((job) => job.status === "queued" || job.status === "processing")
  React.useEffect(() => {
    if (!running) return
    const timer = setInterval(() => void list.refetch(), 3000)
    return () => clearInterval(timer)
  }, [running, list])

  const remove = async () => {
    if (!deleting) return
    try {
      await api.delete(`/video-jobs/${deleting.id}/`)
      toast.success("Video analysis deleted.")
      void list.refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete.")
      throw err
    }
  }

  const columns: Column<VideoJob>[] = [
    {
      header: "Video",
      cell: (job) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
            {job.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.preview} alt="" className="size-full object-cover" />
            ) : (
              <FilmIcon className="size-4" />
            )}
          </div>
          <div>
            <p className="font-medium">#{job.id}</p>
            <p className="max-w-40 truncate text-xs text-muted-foreground">{job.location || "No location"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (job) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          {(job.status === "processing" || job.status === "queued") && <span className="text-xs text-muted-foreground tabular-nums">{job.progress}%</span>}
        </div>
      ),
    },
    { header: "Length", cell: (job) => (job.status === "completed" ? formatClock(job.duration) : "—") },
    { header: "Vehicles", className: "tabular-nums", cell: (job) => (job.status === "completed" ? job.vehicle_count : "—") },
    {
      header: "Violations",
      cell: (job) => (job.status === "completed" ? <Badge variant={job.event_count ? "destructive" : "secondary"}>{job.event_count}</Badge> : "—"),
    },
    { header: "Uploaded by", cell: (job) => job.uploaded_by_name || "—" },
    { header: "When", className: "whitespace-nowrap", cell: (job) => formatDateTime(job.created_at) },
    { header: "", className: "w-12", cell: (job) => <RowActions onDelete={isAdmin ? () => setDeleting(job) : undefined} /> },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Video analysis"
        description="Upload traffic footage. The system tracks vehicles, reads plates and flags violations for your review."
        actions={
          <Button asChild>
            <Link href="/dashboard/video/new">
              <PlusIcon /> Analyse a video
            </Link>
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search by location…" />
        <FilterTabs value={list.filters.status} onChange={(value) => list.setFilter("status", value)} options={STATUS_OPTIONS} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(job) => job.id}
        loading={list.loading}
        onRowClick={(job) => router.push(`/dashboard/video/${job.id}`)}
        emptyTitle="No videos analysed yet"
        emptyDescription="Upload a traffic video to find wrong-way driving, illegal parking, triple riding and more."
        emptyAction={
          <Button asChild>
            <Link href="/dashboard/video/new">Analyse your first video</Link>
          </Button>
        }
        pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this analysis?"
        description="The video results and detected events are removed. Challans already issued stay on record."
        confirmLabel="Delete"
        destructive
        onConfirm={remove}
      />
    </PageContainer>
  )
}
