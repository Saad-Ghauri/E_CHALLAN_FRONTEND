"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/format"
import type { ViolationType } from "@/lib/types"

export function ViolationPicker({
  options,
  selected,
  onToggle,
  suggestedIds,
  loading,
}: {
  options: ViolationType[]
  selected: Set<number>
  onToggle: (id: number) => void
  suggestedIds: Set<number>
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {options.map((type) => (
        <li key={type.id}>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5">
            <Checkbox checked={selected.has(type.id)} onCheckedChange={() => onToggle(type.id)} />
            <span className="min-w-0 flex-1">
              <span className="block leading-snug font-medium">{type.name}</span>
              <span className="text-xs text-muted-foreground">{formatCurrency(type.fine_amount)}</span>
            </span>
            {suggestedIds.has(type.id) && <Badge variant="destructive">Detected</Badge>}
          </label>
        </li>
      ))}
    </ul>
  )
}
