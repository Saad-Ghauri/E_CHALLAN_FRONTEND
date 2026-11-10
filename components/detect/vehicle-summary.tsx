import { CarIcon, HelpCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { VehicleBrief } from "@/lib/types"

function Flag({ label, bad, date }: { label: string; bad: boolean; date: string | null }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        {formatDate(date)}
        <Badge variant={bad ? "destructive" : "secondary"}>{bad ? "Expired" : "Valid"}</Badge>
      </span>
    </div>
  )
}

/** Registered-vehicle record matched to the plate, or a "not registered" notice. */
export function VehicleSummary({ vehicle, hasPlate }: { vehicle: VehicleBrief | null; hasPlate: boolean }) {
  if (!vehicle) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-dashed p-3 text-sm">
        <HelpCircleIcon className="mt-0.5 size-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {hasPlate
            ? "No registered vehicle matches this plate. It will be treated as an unregistered vehicle."
            : "Enter or correct the plate number to look up the vehicle."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border p-3 text-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <CarIcon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{vehicle.owner_name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[vehicle.make, vehicle.model, vehicle.color].filter(Boolean).join(" · ") || vehicle.vehicle_type}
          </p>
        </div>
        {vehicle.is_blacklisted && <Badge variant="destructive" className="ml-auto">Blacklisted</Badge>}
      </div>
      <Flag label="Registration" bad={vehicle.is_registration_expired} date={vehicle.registration_expiry} />
      <Flag label="Insurance" bad={vehicle.is_insurance_expired} date={vehicle.insurance_expiry} />
    </div>
  )
}
