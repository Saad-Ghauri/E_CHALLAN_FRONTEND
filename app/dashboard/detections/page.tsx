"use client"

import * as React from "react"
import { FileVideoIcon, ImageIcon } from "lucide-react"

import { DetectionReview } from "@/components/detect/detection-review"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { PlateBadge } from "@/components/shared/plate-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { FilterTabs, SearchInput, Toolbar } from "@/components/shared/toolbar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useList } from "@/hooks/use-list"
import { formatDateTime } from "@/lib/format"
import type { Detection } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Verified" },
  { value: "needs_review", label: "Needs review" },
  { value: "failed", label: "Failed" },
]

const columns: Column<Detection>[] = [
  {
    header: "Media",
    cell: (d) => (
      <span className="flex items-center gap-2 capitalize">
        {d.media_type === "video" ? <FileVideoIcon className="size-4" /> : <ImageIcon className="size-4" />}
        {d.media_type}
      </span>
    ),
  },
  { header: "Plate", cell: (d) => <PlateBadge plate={d.plate_number} /> },
  { header: "Confidence", cell: (d) => `${d.confidence.toFixed(0)}%` },
  { header: "Vehicle", cell: (d) => <span className="capitalize">{d.vehicle_label || "—"}</span> },
  { header: "Status", cell: (d) => <StatusBadge status={d.status} /> },
  { header: "Uploaded by", cell: (d) => d.uploaded_by_name || "—" },
  { header: "When", cell: (d) => formatDateTime(d.created_at) },
]

export default function DetectionLogsPage() {
  const list = useList<Detection>("/detections/", { status: "all" })
  const [selected, setSelected] = React.useState<Detection | null>(null)

  return (
    <PageContainer>
      <PageHeader title="Detection logs" description="Every upload processed by the AI pipeline. Open a row to review or issue a challan." />

      <Toolbar>
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search plate or location…" />
        <FilterTabs value={list.filters.status} onChange={(value) => list.setFilter("status", value)} options={STATUS_OPTIONS} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(d) => d.id}
        loading={list.loading}
        onRowClick={setSelected}
        emptyTitle="No detections yet"
        emptyDescription="Upload an image or video on the Detect page to get started."
        emptyAction={
          <Button asChild>
            <Link href="/dashboard/detect">Go to Detect &amp; Issue</Link>
          </Button>
        }
        pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
      />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Detection #{selected?.id}</DialogTitle>
            <DialogDescription>{selected && formatDateTime(selected.created_at)}</DialogDescription>
          </DialogHeader>
          {selected && (
            <DetectionReview
              key={`${selected.id}-${selected.plate_number}`}
              detection={selected}
              onChange={(updated) => {
                setSelected(updated)
                list.refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
