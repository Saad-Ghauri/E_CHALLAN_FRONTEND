"use client"

import { useRouter } from "next/navigation"

import { DataTable, type Column } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { FilterTabs, SearchInput, Toolbar } from "@/components/shared/toolbar"
import { useList } from "@/hooks/use-list"
import { formatCurrency, formatDate } from "@/lib/format"
import type { CitizenChallan } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
]

const columns: Column<CitizenChallan>[] = [
  { header: "Challan", cell: (c) => <span className="font-medium">{c.challan_number}</span> },
  { header: "Plate", cell: (c) => <PlateBadge plate={c.plate_number} /> },
  { header: "Violations", className: "max-w-56", cell: (c) => <span className="block truncate">{c.items.map((i) => i.name).join(", ")}</span> },
  { header: "Due", cell: (c) => formatDate(c.due_date) },
  { header: "Fine", className: "text-right tabular-nums", cell: (c) => formatCurrency(c.total_fine) },
  {
    header: "Status",
    cell: (c) => (
      <div className="flex items-center gap-1.5">
        <StatusBadge status={challanStatus(c)} />
        {c.appeal?.status === "pending" && <StatusBadge status="pending" label="Appeal" />}
      </div>
    ),
  },
]

export default function CitizenChallansPage() {
  const router = useRouter()
  const list = useList<CitizenChallan>("/citizen/challans/", { status: "all" })

  return (
    <>
      <PageHeader title="My challans" description="Challans issued to the vehicles linked to your account." />
      <Toolbar>
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search challan number, plate, location…" />
        <FilterTabs value={list.filters.status} onChange={(value) => list.setFilter("status", value)} options={STATUS_OPTIONS} />
      </Toolbar>
      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(c) => c.id}
        loading={list.loading}
        onRowClick={(c) => router.push(`/citizen/challans/${c.id}`)}
        emptyTitle="No challans found"
        emptyDescription="Link a vehicle under My vehicles to see its challans here."
        pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
      />
    </>
  )
}
