"use client"

import { useRouter } from "next/navigation"
import { ScanSearchIcon } from "lucide-react"
import Link from "next/link"

import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { FilterTabs, SearchInput, Toolbar } from "@/components/shared/toolbar"
import { Button } from "@/components/ui/button"
import { useList } from "@/hooks/use-list"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Challan } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
]

const columns: Column<Challan>[] = [
  { header: "Challan", cell: (c) => <span className="font-medium">{c.challan_number}</span> },
  { header: "Plate", cell: (c) => <PlateBadge plate={c.plate_number} /> },
  {
    header: "Violations",
    className: "max-w-60",
    cell: (c) => <span className="block truncate">{c.items.map((item) => item.name).join(", ")}</span>,
  },
  { header: "Issued", cell: (c) => formatDate(c.issued_at) },
  { header: "Due", cell: (c) => formatDate(c.due_date) },
  { header: "Fine", className: "text-right tabular-nums", cell: (c) => formatCurrency(c.total_fine) },
  { header: "Status", cell: (c) => <StatusBadge status={challanStatus(c)} /> },
]

export default function ChallansPage() {
  const router = useRouter()
  const list = useList<Challan>("/challans/", { status: "all" })

  return (
    <PageContainer>
      <PageHeader
        title="Challan records"
        description="Complete history of issued e-challans."
        actions={
          <Button asChild>
            <Link href="/dashboard/detect">
              <ScanSearchIcon /> Issue new
            </Link>
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search plate, challan no., owner…" />
        <FilterTabs value={list.filters.status} onChange={(value) => list.setFilter("status", value)} options={STATUS_OPTIONS} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(c) => c.id}
        loading={list.loading}
        onRowClick={(c) => router.push(`/dashboard/challans/${c.id}`)}
        emptyTitle="No challans found"
        pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
      />
    </PageContainer>
  )
}
