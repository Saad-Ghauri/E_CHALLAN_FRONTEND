"use client"

import { FormDialog, FormField } from "@/components/shared/form-dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@/hooks/use-form"
import type { ViolationType } from "@/lib/types"

type ViolationForm = {
  code: string
  name: string
  fine_amount: string
  description: string
  auto_detectable: boolean
  is_active: boolean
}

const blank: ViolationForm = {
  code: "",
  name: "",
  fine_amount: "",
  description: "",
  auto_detectable: false,
  is_active: true,
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export function ViolationFormDialog({
  violation,
  onClose,
  onSave,
}: {
  violation: ViolationType | null
  onClose: () => void
  onSave: (values: object) => Promise<void>
}) {
  const form = useForm<ViolationForm>(
    violation ? { ...violation, fine_amount: String(violation.fine_amount) } : blank
  )
  const { values, errors, bind } = form

  const submit = form.submit((v) =>
    onSave({ ...v, code: v.code || slugify(v.name), fine_amount: Number(v.fine_amount) })
  )

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={violation ? "Edit violation type" : "Add violation type"}
      submitting={form.submitting}
      onSubmit={submit}
    >
      <FormField label="Name" htmlFor="name" error={errors.name} className="sm:col-span-2">
        <Input {...bind("name")} placeholder="Over speeding" required />
      </FormField>
      <FormField label="Fine (PKR)" htmlFor="fine_amount" error={errors.fine_amount}>
        <Input {...bind("fine_amount")} type="number" min={0} step={50} required />
      </FormField>
      <FormField label="Code" htmlFor="code" error={errors.code} hint="Auto-generated from the name if left empty.">
        <Input {...bind("code")} placeholder="over-speeding" disabled={Boolean(violation)} />
      </FormField>
      <FormField label="Description" htmlFor="description" className="sm:col-span-2">
        <Textarea {...bind("description")} rows={2} />
      </FormField>
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={values.is_active} onCheckedChange={(checked) => form.set("is_active", checked)} />
        Active
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={values.auto_detectable} onCheckedChange={(checked) => form.set("auto_detectable", checked)} />
        Raised automatically by rules
      </label>
    </FormDialog>
  )
}
