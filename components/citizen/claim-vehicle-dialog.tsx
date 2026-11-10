"use client"

import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { FormDialog, FormField } from "@/components/shared/form-dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "@/hooks/use-form"
import { api } from "@/lib/api"
import { formatCnic, formatPlate } from "@/lib/format"

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
      <FormField label="Number plate" htmlFor="plate_number" required hint="As written on your number plate, for example LEA-1234." error={form.errors.plate_number} className="sm:col-span-2">
        <Input {...form.bind("plate_number", formatPlate)} placeholder="LEA-1234" className="font-mono uppercase" autoFocus required />
      </FormField>
      <FormField
        label="Owner CNIC"
        htmlFor="cnic"
        required
        error={form.errors.cnic || form.errors.detail}
        hint="13 digits, exactly as registered for this vehicle. Not working? Check your registration book, or ask a traffic office to update the record."
        className="sm:col-span-2"
      >
        <Input {...form.bind("cnic", formatCnic)} placeholder="35202-1234567-1" inputMode="numeric" required />
      </FormField>
    </FormDialog>
  )
}
