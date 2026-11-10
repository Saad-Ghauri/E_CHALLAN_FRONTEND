"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DataTable, type Column } from "@/components/shared/data-table"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { SelectField } from "@/components/shared/select-field"
import { SearchInput, Toolbar } from "@/components/shared/toolbar"
import { Badge } from "@/components/ui/badge"
import { useList } from "@/hooks/use-list"
import { formatDateTime } from "@/lib/format"
import type { AuditEntry } from "@/lib/types"

const ACTIONS = [
  "challan.issued",
  "challan.paid",
  "challan.cancelled",
  "appeal.submitted",
  "appeal.decided",
  "user.created",
  "user.approved",
  "user.updated",
  "user.deleted",
  "vehicle.claimed",
  "video.uploaded",
]
const ACTION_OPTIONS = [{ value: "all", label: "All actions" }, ...ACTIONS.map((a) => ({ value: a, label: a }))]

const columns: Column<AuditEntry>[] = [
  { header: "When", className: "whitespace-nowrap", cell: (e) => formatDateTime(e.created_at) },
  { header: "User", cell: (e) => e.user_name },
  { header: "Action", cell: (e) => <Badge variant="secondary" className="font-mono">{e.action}</Badge> },
  { header: "Details", className: "max-w-96", cell: (e) => <span className="block truncate">{e.description}</span> },
  { header: "IP", cell: (e) => <span className="font-mono text-xs text-muted-foreground">{e.ip_address ?? "—"}</span> },
]

export default function AuditLogPage() {
  const list = useList<AuditEntry>("/audit-logs/", { action: "all" })

  return (
    <AuthGuard adminOnly>
      <PageContainer>
        <PageHeader title="Audit log" description="A permanent record of who issued, paid, cancelled, approved or deleted what." />
        <Toolbar>
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search details or user e-mail…" />
          <SelectField value={list.filters.action} onChange={(value) => list.setFilter("action", value)} options={ACTION_OPTIONS} className="w-full sm:w-52" />
        </Toolbar>
        <DataTable
          columns={columns}
          rows={list.items}
          rowKey={(e) => e.id}
          loading={list.loading}
          emptyTitle="No activity recorded yet"
          pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
        />
      </PageContainer>
    </AuthGuard>
  )
}
