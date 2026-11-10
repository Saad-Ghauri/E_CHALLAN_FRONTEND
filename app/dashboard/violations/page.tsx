"use client"

import { PlusIcon } from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { DataTable, type Column } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/form-dialog"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { RowActions } from "@/components/shared/row-actions"
import { SearchInput, Toolbar } from "@/components/shared/toolbar"
import { ViolationFormDialog } from "@/components/violations/violation-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCrudDialog } from "@/hooks/use-crud-dialog"
import { useList } from "@/hooks/use-list"
import { formatCurrency } from "@/lib/format"
import type { ViolationType } from "@/lib/types"

export default function ViolationTypesPage() {
  const list = useList<ViolationType>("/violation-types/")
  const crud = useCrudDialog<ViolationType>("/violation-types/", "Violation type", list.refetch)

  const columns: Column<ViolationType>[] = [
    {
      header: "Violation",
      cell: (v) => (
        <div>
          <p className="font-medium">{v.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{v.code}</p>
        </div>
      ),
    },
    { header: "Fine", className: "tabular-nums", cell: (v) => formatCurrency(v.fine_amount) },
    {
      header: "Detection",
      cell: (v) => <Badge variant={v.auto_detectable ? "default" : "secondary"}>{v.auto_detectable ? "Automatic" : "Officer observed"}</Badge>,
    },
    {
      header: "Status",
      cell: (v) => <Badge variant={v.is_active ? "outline" : "secondary"}>{v.is_active ? "Active" : "Disabled"}</Badge>,
    },
    {
      header: "",
      className: "w-24",
      cell: (v) => <RowActions onEdit={() => crud.openEdit(v)} onDelete={() => crud.setDeleting(v)} />,
    },
  ]

  return (
    <AuthGuard adminOnly>
      <PageContainer>
        <PageHeader
          title="Violation types"
          description="Offences and fines used when issuing challans."
          actions={
            <Button onClick={crud.openCreate}>
              <PlusIcon /> Add violation
            </Button>
          }
        />

        <Toolbar>
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search violations…" />
        </Toolbar>

        <DataTable
          columns={columns}
          rows={list.items}
          rowKey={(v) => v.id}
          loading={list.loading}
          pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
        />

        {crud.open && (
          <ViolationFormDialog violation={crud.editing} onClose={() => crud.setOpen(false)} onSave={crud.save} />
        )}

        <ConfirmDialog
          open={Boolean(crud.deleting)}
          onOpenChange={(open) => !open && crud.setDeleting(null)}
          title="Delete violation type?"
          description={`“${crud.deleting?.name}” can't be deleted if challans already use it — disable it instead.`}
          confirmLabel="Delete"
          destructive
          onConfirm={crud.confirmDelete}
        />
      </PageContainer>
    </AuthGuard>
  )
}
