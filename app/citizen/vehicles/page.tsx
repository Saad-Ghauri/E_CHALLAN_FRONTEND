"use client"

import * as React from "react"
import { toast } from "sonner"
import { CarIcon, PlusIcon, UnlinkIcon } from "lucide-react"

import { ClaimVehicleDialog } from "@/components/citizen/claim-vehicle-dialog"
import { ConfirmDialog } from "@/components/shared/form-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { PlateBadge } from "@/components/shared/plate-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/hooks/use-api"
import { api, ApiError } from "@/lib/api"
import { formatDate } from "@/lib/format"
import type { VehicleBrief } from "@/lib/types"

function Validity({ label, date, expired }: { label: string; date: string | null; expired: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        {formatDate(date)}
        <Badge variant={expired ? "destructive" : "secondary"}>{expired ? "Expired" : "Valid"}</Badge>
      </span>
    </div>
  )
}

export default function CitizenVehiclesPage() {
  const { data: vehicles, loading, refetch } = useApi<VehicleBrief[]>("/citizen/vehicles/")
  const [adding, setAdding] = React.useState(false)
  const [unlinking, setUnlinking] = React.useState<VehicleBrief | null>(null)

  const unlink = async () => {
    if (!unlinking) return
    try {
      await api.delete(`/citizen/vehicles/${unlinking.id}/`)
      toast.success("Vehicle removed from your account.")
      void refetch()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not remove the vehicle.")
      throw err
    }
  }

  return (
    <>
      <PageHeader
        title="My vehicles"
        description="Vehicles linked to your account. Their challans appear under My challans."
        actions={
          <Button onClick={() => setAdding(true)}>
            <PlusIcon /> Add vehicle
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : vehicles?.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <PlateBadge plate={vehicle.plate_number} className="text-sm" />
                  <Button variant="ghost" size="icon-sm" onClick={() => setUnlinking(vehicle)} aria-label={`Remove ${vehicle.plate_number}`}>
                    <UnlinkIcon />
                  </Button>
                </div>
                <p className="text-sm font-medium capitalize">
                  {[vehicle.make, vehicle.model, vehicle.color].filter(Boolean).join(" · ") || vehicle.vehicle_type}
                </p>
                <Validity label="Registration" date={vehicle.registration_expiry} expired={vehicle.is_registration_expired} />
                <Validity label="Insurance" date={vehicle.insurance_expiry} expired={vehicle.is_insurance_expired} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CarIcon}
          title="No vehicles linked yet"
          description="Add your vehicle with its number plate and your CNIC."
          action={
            <Button onClick={() => setAdding(true)}>
              <PlusIcon /> Add vehicle
            </Button>
          }
        />
      )}

      {adding && <ClaimVehicleDialog onClose={() => setAdding(false)} onClaimed={refetch} />}
      <ConfirmDialog
        open={Boolean(unlinking)}
        onOpenChange={(open) => !open && setUnlinking(null)}
        title="Remove this vehicle?"
        description={`${unlinking?.plate_number} will no longer show up in your account. You can add it again later.`}
        confirmLabel="Remove"
        destructive
        onConfirm={unlink}
      />
    </>
  )
}
