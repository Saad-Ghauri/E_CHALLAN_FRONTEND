"use client"

import { PlusIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { DataTable, type Column } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/form-dialog"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { RowActions } from "@/components/shared/row-actions"
import { SelectField } from "@/components/shared/select-field"
import { SearchInput, Toolbar } from "@/components/shared/toolbar"
import { VehicleFormDialog, VEHICLE_TYPES } from "@/components/vehicles/vehicle-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCrudDialog } from "@/hooks/use-crud-dialog"
import { useList } from "@/hooks/use-list"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Vehicle } from "@/lib/types"

const TYPE_FILTER = [{ value: "all", label: "All types" }, ...VEHICLE_TYPES]

function ExpiryCell({ date, expired }: { date: string | null; expired: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {formatDate(date)}
      {expired && <Badge variant="destructive">Expired</Badge>}
    </span>
  )
}

export default function VehiclesPage() {
  const { isAdmin } = useAuth()
  const list = useList<Vehicle>("/vehicles/", { vehicle_type: "all" })
  const crud = useCrudDialog<Vehicle>("/vehicles/", "Vehicle", list.refetch)

  const columns: Column<Vehicle>[] = [
    { header: "Plate", cell: (v) => <PlateBadge plate={v.plate_number} /> },
    {
      header: "Owner",
      cell: (v) => (
        <div>
          <p className="font-medium">{v.owner_name}</p>
          {v.is_blacklisted && <Badge variant="destructive">Blacklisted</Badge>}
        </div>
      ),
    },
    {
      header: "Vehicle",
      cell: (v) => (
        <span className="capitalize">{[v.make, v.model].filter(Boolean).join(" ") || v.vehicle_type}</span>
      ),
    },
    { header: "Registration", cell: (v) => <ExpiryCell date={v.registration_expiry} expired={v.is_registration_expired} /> },
    { header: "Insurance", cell: (v) => <ExpiryCell date={v.insurance_expiry} expired={v.is_insurance_expired} /> },
    {
      header: "Challans",
      cell: (v) => (
        <span className="tabular-nums">
          {v.challan_count}
          {v.unpaid_amount > 0 && <span className="text-muted-foreground"> · {formatCurrency(v.unpaid_amount)} due</span>}
        </span>
      ),
    },
    {
      header: "",
      className: "w-24",
      cell: (v) => <RowActions onEdit={() => crud.openEdit(v)} onDelete={isAdmin ? () => crud.setDeleting(v) : undefined} />,
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Vehicle records"
        description="Registered vehicles and owners. Detected plates are matched against this list."
        actions={
          <Button onClick={crud.openCreate}>
            <PlusIcon /> Add vehicle
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search plate, owner, CNIC…" />
        <SelectField
          value={list.filters.vehicle_type}
          onChange={(value) => list.setFilter("vehicle_type", value)}
          options={TYPE_FILTER}
          className="w-full sm:w-44"
        />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(v) => v.id}
        loading={list.loading}
        emptyTitle="No vehicles found"
        emptyDescription="Add a vehicle to start matching detected plates to owners."
        pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
      />

      {crud.open && (
        <VehicleFormDialog vehicle={crud.editing} onClose={() => crud.setOpen(false)} onSave={crud.save} />
      )}

      <ConfirmDialog
        open={Boolean(crud.deleting)}
        onOpenChange={(open) => !open && crud.setDeleting(null)}
        title="Delete vehicle?"
        description={`${crud.deleting?.plate_number} will be removed. Its challans stay on record.`}
        confirmLabel="Delete"
        destructive
        onConfirm={crud.confirmDelete}
      />
    </PageContainer>
  )
}
