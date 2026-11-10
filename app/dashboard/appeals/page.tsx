"use client"

import * as React from "react"

import { AppealReviewDialog } from "@/components/appeals/appeal-review-dialog"
import { AuthGuard } from "@/components/auth-guard"
import { DataTable, type Column } from "@/components/shared/data-table"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { FilterTabs, SearchInput, Toolbar } from "@/components/shared/toolbar"
import { useList } from "@/hooks/use-list"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Appeal } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
]

const columns: Column<Appeal>[] = [
  { header: "Challan", cell: (a) => <span className="font-medium">{a.challan_number}</span> },
  { header: "Plate", cell: (a) => <PlateBadge plate={a.plate_number} /> },
  { header: "Citizen", cell: (a) => a.submitted_by_name || "—" },
  { header: "Fine", className: "tabular-nums", cell: (a) => formatCurrency(a.total_fine) },
  { header: "Reason", className: "max-w-64", cell: (a) => <span className="block truncate">{a.reason}</span> },
  { header: "Submitted", cell: (a) => formatDate(a.created_at) },
  { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
]

export default function AppealsPage() {
  const list = useList<Appeal>("/appeals/", { status: "pending" })
  const [selected, setSelected] = React.useState<Appeal | null>(null)

  return (
    <AuthGuard adminOnly>
      <PageContainer>
        <PageHeader title="Appeals" description="Citizens can appeal a challan. Accepting an appeal cancels the challan." />
        <Toolbar>
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search challan, plate, reason…" />
          <FilterTabs value={list.filters.status} onChange={(value) => list.setFilter("status", value)} options={STATUS_OPTIONS} />
        </Toolbar>
        <DataTable
          columns={columns}
          rows={list.items}
          rowKey={(a) => a.id}
          loading={list.loading}
          onRowClick={setSelected}
          emptyTitle="No appeals here"
          emptyDescription="Appeals submitted by citizens will show up in this list."
          pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
        />
        {selected && <AppealReviewDialog appeal={selected} onClose={() => setSelected(null)} onDecided={list.refetch} />}
      </PageContainer>
    </AuthGuard>
  )
}
