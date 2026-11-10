"use client"

import * as React from "react"
import { toast } from "sonner"
import { BanknoteIcon, CreditCardIcon, Loader2Icon, SmartphoneIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api, ApiError } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import type { CitizenChallan, PaymentMethod } from "@/lib/types"
import { cn } from "@/lib/utils"

const METHODS: { value: PaymentMethod; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "card", label: "Debit / credit card", hint: "Visa, Mastercard, PayPak", icon: CreditCardIcon },
  { value: "jazzcash", label: "JazzCash", hint: "Mobile wallet", icon: SmartphoneIcon },
  { value: "easypaisa", label: "Easypaisa", hint: "Mobile wallet", icon: SmartphoneIcon },
  { value: "bank", label: "Bank transfer", hint: "Raast / online banking", icon: BanknoteIcon },
]

/** Demo checkout: no real payment gateway is connected, the challan is simply marked as paid. */
export function PayDialog({
  challan,
  open,
  onOpenChange,
  onPaid,
}: {
  challan: CitizenChallan
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaid: (challan: CitizenChallan) => void
}) {
  const [method, setMethod] = React.useState<PaymentMethod>("card")
  const [paying, setPaying] = React.useState(false)

  const pay = async () => {
    setPaying(true)
    try {
      const updated = await api.post<CitizenChallan>(`/citizen/challans/${challan.id}/pay/`, { method })
      toast.success(`Payment received. Reference ${updated.payment_reference}`)
      onPaid(updated)
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Payment failed. Please try again.")
    } finally {
      setPaying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay challan {challan.challan_number}</DialogTitle>
          <DialogDescription>Choose how you would like to pay.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
          <span className="text-sm text-muted-foreground">Amount due</span>
          <span className="text-2xl font-semibold tabular-nums">{formatCurrency(challan.total_fine)}</span>
        </div>

        <div role="radiogroup" aria-label="Payment method" className="grid gap-2">
          {METHODS.map(({ value, label, hint, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={method === value}
              onClick={() => setMethod(value)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                method === value && "border-primary bg-primary/5 ring-1 ring-primary/40"
              )}
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
            </button>
          ))}
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
          Demo checkout for this project: no real money is charged and no payment gateway is connected.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={pay} disabled={paying}>
            {paying && <Loader2Icon className="animate-spin" />} Pay {formatCurrency(challan.total_fine)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
