import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const TONES = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
} as const

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  loading,
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: keyof typeof TONES
  loading?: boolean
}) {
  // A zero needs no attention, so it is shown in the neutral tone rather than warning colours.
  const quiet = Number(String(value).replace(/\D/g, "")) === 0 && tone !== "default"
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="font-heading text-3xl font-bold tabular-nums">{value}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("rounded-xl p-2.5", quiet ? "bg-muted text-muted-foreground" : TONES[tone])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
