"use client"

import Link from "next/link"
import { PaperclipIcon } from "lucide-react"

import { DataTable, type Column } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { useList } from "@/hooks/use-list"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Appeal } from "@/lib/types"

const columns: Column<Appeal>[] = [
  {
    header: "Challan",
    cell: (a) => (
      <Link href={`/citizen/challans/${a.challan}`} className="font-medium text-primary underline-offset-4 hover:underline">
        {a.challan_number}
      </Link>
    ),
  },
  { header: "Plate", cell: (a) => <PlateBadge plate={a.plate_number} /> },
  { header: "Fine", className: "tabular-nums", cell: (a) => formatCurrency(a.total_fine) },
  {
    header: "Your reason",
    className: "max-w-64",
    cell: (a) => (
      <span className="flex items-center gap-1.5">
        <span className="truncate">{a.reason}</span>
        {a.evidence && <PaperclipIcon className="size-3.5 shrink-0 text-muted-foreground" />}
      </span>
    ),
  },
  { header: "Submitted", cell: (a) => formatDate(a.created_at) },
  {
    header: "Decision",
    className: "max-w-56",
    cell: (a) => (
      <div className="space-y-1">
        <StatusBadge status={a.status} />
        {a.decision_note && <p className="truncate text-xs text-muted-foreground">{a.decision_note}</p>}
      </div>
    ),
  },
]

export default function CitizenAppealsPage() {
  const list = useList<Appeal>("/citizen/appeals/")

  return (
    <>
      <PageHeader title="My appeals" description="Open a challan and choose Appeal if you believe it was issued by mistake." />
      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(a) => a.id}
        loading={list.loading}
        emptyTitle="No appeals yet"
        emptyDescription="Appeals you submit will be listed here with the decision."
        pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
      />
    </>
  )
}
