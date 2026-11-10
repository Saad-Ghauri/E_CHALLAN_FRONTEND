"use client"

import { toast } from "sonner"
import { CheckIcon, PlusIcon } from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/providers/auth-provider"
import { DataTable, type Column } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/form-dialog"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { RowActions } from "@/components/shared/row-actions"
import { FilterTabs, SearchInput, Toolbar } from "@/components/shared/toolbar"
import { UserFormDialog } from "@/components/users/user-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCrudDialog } from "@/hooks/use-crud-dialog"
import { useList } from "@/hooks/use-list"
import { api, ApiError } from "@/lib/api"
import { formatDate } from "@/lib/format"
import type { User } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Pending / disabled" },
]

export default function UsersPage() {
  const { user: me } = useAuth()
  const list = useList<User>("/users/", { is_active: "all" })
  const crud = useCrudDialog<User>("/users/", "User", list.refetch)

  const approve = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}/`, { is_active: true })
      toast.success(`${user.full_name} approved.`)
      list.refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not approve user.")
    }
  }

  const columns: Column<User>[] = [
    {
      header: "User",
      cell: (u) => (
        <div>
          <p className="font-medium">{u.full_name}</p>
          <p className="text-xs text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (u) => (
        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
          {{ admin: "Administrator", officer: "Officer", citizen: "Citizen" }[u.role]}
        </Badge>
      ),
    },
    { header: "Badge", cell: (u) => u.badge_number || "—" },
    { header: "Joined", cell: (u) => formatDate(u.date_joined) },
    {
      header: "Status",
      cell: (u) =>
        u.is_active ? (
          <Badge variant="outline">Active</Badge>
        ) : (
          <Button size="xs" variant="outline" onClick={() => approve(u)}>
            <CheckIcon /> Approve
          </Button>
        ),
    },
    {
      header: "",
      className: "w-24",
      cell: (u) => <RowActions onEdit={() => crud.openEdit(u)} onDelete={u.id === me?.id ? undefined : () => crud.setDeleting(u)} />,
    },
  ]

  return (
    <AuthGuard adminOnly>
      <PageContainer>
        <PageHeader
          title="Users"
          description="Approve officer sign-ups and manage who can access the system."
          actions={
            <Button onClick={crud.openCreate}>
              <PlusIcon /> Add user
            </Button>
          }
        />

        <Toolbar>
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search name, email, badge…" />
          <FilterTabs value={list.filters.is_active} onChange={(value) => list.setFilter("is_active", value)} options={STATUS_OPTIONS} />
        </Toolbar>

        <DataTable
          columns={columns}
          rows={list.items}
          rowKey={(u) => u.id}
          loading={list.loading}
          pagination={{ page: list.page, pageCount: list.pageCount, count: list.count, onPageChange: list.setPage }}
        />

        {crud.open && <UserFormDialog user={crud.editing} onClose={() => crud.setOpen(false)} onSave={crud.save} />}

        <ConfirmDialog
          open={Boolean(crud.deleting)}
          onOpenChange={(open) => !open && crud.setDeleting(null)}
          title="Delete user?"
          description={`${crud.deleting?.full_name} will lose access. Challans they issued stay on record.`}
          confirmLabel="Delete"
          destructive
          onConfirm={crud.confirmDelete}
        />
      </PageContainer>
    </AuthGuard>
  )
}
