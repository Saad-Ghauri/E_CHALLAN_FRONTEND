"use client"

import { FormDialog, FormField } from "@/components/shared/form-dialog"
import { SelectField } from "@/components/shared/select-field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useForm } from "@/hooks/use-form"
import type { Role, User } from "@/lib/types"

export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "officer", label: "Traffic officer" },
  { value: "admin", label: "Administrator" },
  { value: "citizen", label: "Citizen" },
]

type UserForm = {
  first_name: string
  last_name: string
  email: string
  role: Role
  badge_number: string
  phone: string
  password: string
  is_active: boolean
}

const blank: UserForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "officer",
  badge_number: "",
  phone: "",
  password: "",
  is_active: true,
}

export function UserFormDialog({
  user,
  onClose,
  onSave,
}: {
  user: User | null
  onClose: () => void
  onSave: (values: object) => Promise<void>
}) {
  const form = useForm<UserForm>(user ? { ...blank, ...user } : blank)
  const { values, errors, bind } = form

  // Leave the password out when editing and nothing was typed.
  const submit = form.submit(({ password, ...rest }) => onSave(password ? { ...rest, password } : rest))

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={user ? "Edit user" : "Add user"}
      submitting={form.submitting}
      onSubmit={submit}
    >
      <FormField label="First name" htmlFor="first_name" error={errors.first_name}>
        <Input {...bind("first_name")} required />
      </FormField>
      <FormField label="Last name" htmlFor="last_name" error={errors.last_name}>
        <Input {...bind("last_name")} required />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email} className="sm:col-span-2">
        <Input {...bind("email")} type="email" required />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <SelectField id="role" value={values.role} onChange={(role) => form.set("role", role as Role)} options={ROLE_OPTIONS} />
      </FormField>
      <FormField label="Badge number" htmlFor="badge_number" error={errors.badge_number}>
        <Input {...bind("badge_number")} />
      </FormField>
      <FormField label="Phone" htmlFor="phone">
        <Input {...bind("phone")} />
      </FormField>
      <FormField
        label={user ? "New password" : "Password"}
        htmlFor="password"
        error={errors.password}
        hint={user ? "Leave empty to keep the current password." : undefined}
      >
        <Input {...bind("password")} type="password" autoComplete="new-password" required={!user} />
      </FormField>
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <Switch checked={values.is_active} onCheckedChange={(checked) => form.set("is_active", checked)} />
        Account active
      </label>
    </FormDialog>
  )
}
