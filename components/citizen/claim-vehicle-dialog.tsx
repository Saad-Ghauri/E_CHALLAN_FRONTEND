"use client"

import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { FormDialog, FormField } from "@/components/shared/form-dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "@/hooks/use-form"
import { api } from "@/lib/api"

/** Link a vehicle to this account. The CNIC must match the owner CNIC on the vehicle record. */
export function ClaimVehicleDialog({ onClose, onClaimed }: { onClose: () => void; onClaimed: () => void }) {
  const { user } = useAuth()
  const form = useForm({ plate_number: "", cnic: user?.cnic ?? "" })

  const submit = form.submit(async (values) => {
    await api.post("/citizen/vehicles/", values)
    toast.success("Vehicle linked to your account.")
    onClaimed()
    onClose()
  })

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Add a vehicle"
      description="Enter the plate and the CNIC of the registered owner to confirm the vehicle is yours."
      submitLabel="Verify and add"
      submitting={form.submitting}
      onSubmit={submit}
    >
      <FormField label="Number plate" htmlFor="plate_number" error={form.errors.plate_number} className="sm:col-span-2">
        <Input {...form.bind("plate_number")} placeholder="LEA-1234" className="font-mono uppercase" required />
      </FormField>
      <FormField
        label="Owner CNIC"
        htmlFor="cnic"
        error={form.errors.cnic || form.errors.detail}
        hint="Must match the CNIC registered for this vehicle."
        className="sm:col-span-2"
      >
        <Input {...form.bind("cnic")} placeholder="35202-1234567-1" required />
      </FormField>
    </FormDialog>
  )
}
