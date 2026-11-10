"use client"

import { FormDialog, FormField } from "@/components/shared/form-dialog"
import { SelectField } from "@/components/shared/select-field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@/hooks/use-form"
import type { Vehicle, VehicleType } from "@/lib/types"

export const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "car", label: "Car" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "truck", label: "Truck" },
  { value: "bus", label: "Bus" },
  { value: "rickshaw", label: "Rickshaw" },
  { value: "other", label: "Other" },
]

const blank = {
  plate_number: "",
  vehicle_type: "car" as VehicleType,
  make: "",
  model: "",
  color: "",
  owner_name: "",
  owner_cnic: "",
  owner_phone: "",
  owner_address: "",
  registration_expiry: "",
  insurance_expiry: "",
  is_blacklisted: false,
  notes: "",
}

type VehicleForm = typeof blank

const fromVehicle = (v: Vehicle): VehicleForm => ({
  ...blank,
  ...v,
  registration_expiry: v.registration_expiry ?? "",
  insurance_expiry: v.insurance_expiry ?? "",
})

/** Only the editable fields, with empty dates as null for the API. */
const toPayload = (values: VehicleForm) => ({
  ...Object.fromEntries(Object.keys(blank).map((key) => [key, values[key as keyof VehicleForm]])),
  registration_expiry: values.registration_expiry || null,
  insurance_expiry: values.insurance_expiry || null,
})

/** Mount only while open so the form state always starts fresh. */
export function VehicleFormDialog({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: Vehicle | null
  onClose: () => void
  onSave: (values: object) => Promise<void>
}) {
  const form = useForm<VehicleForm>(vehicle ? fromVehicle(vehicle) : blank)
  const { values, errors, bind } = form

  const submit = form.submit((v) => onSave(toPayload(v)))

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={vehicle ? "Edit vehicle" : "Add vehicle"}
      description="Registered vehicle and owner details used to match detected plates."
      submitting={form.submitting}
      onSubmit={submit}
      className="max-w-2xl"
    >
      <FormField label="Plate number" htmlFor="plate_number" error={errors.plate_number}>
        <Input {...bind("plate_number")} placeholder="LEA-1234" className="font-mono uppercase" required />
      </FormField>
      <FormField label="Vehicle type" htmlFor="vehicle_type">
        <SelectField id="vehicle_type" value={values.vehicle_type} onChange={(v) => form.set("vehicle_type", v as VehicleType)} options={VEHICLE_TYPES} />
      </FormField>
      <FormField label="Make" htmlFor="make" error={errors.make}>
        <Input {...bind("make")} placeholder="Toyota" />
      </FormField>
      <FormField label="Model" htmlFor="model" error={errors.model}>
        <Input {...bind("model")} placeholder="Corolla" />
      </FormField>
      <FormField label="Colour" htmlFor="color">
        <Input {...bind("color")} />
      </FormField>
      <FormField label="Owner name" htmlFor="owner_name" error={errors.owner_name}>
        <Input {...bind("owner_name")} required />
      </FormField>
      <FormField label="Owner CNIC" htmlFor="owner_cnic" error={errors.owner_cnic}>
        <Input {...bind("owner_cnic")} placeholder="35202-1234567-1" />
      </FormField>
      <FormField label="Owner phone" htmlFor="owner_phone">
        <Input {...bind("owner_phone")} />
      </FormField>
      <FormField label="Registration expiry" htmlFor="registration_expiry" error={errors.registration_expiry}>
        <Input {...bind("registration_expiry")} type="date" />
      </FormField>
      <FormField label="Insurance expiry" htmlFor="insurance_expiry" error={errors.insurance_expiry}>
        <Input {...bind("insurance_expiry")} type="date" />
      </FormField>
      <FormField label="Owner address" htmlFor="owner_address" className="sm:col-span-2">
        <Input {...bind("owner_address")} />
      </FormField>
      <FormField label="Notes" htmlFor="notes" className="sm:col-span-2">
        <Textarea {...bind("notes")} rows={2} />
      </FormField>
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <Switch checked={values.is_blacklisted} onCheckedChange={(checked) => form.set("is_blacklisted", checked)} />
        Blacklisted (stolen / wanted vehicle)
      </label>
    </FormDialog>
  )
}
