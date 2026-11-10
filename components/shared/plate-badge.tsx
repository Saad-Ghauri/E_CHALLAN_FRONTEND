import { cn } from "@/lib/utils"

/** Number plate styled like a real plate so it's instantly recognisable in tables. */
export function PlateBadge({ plate, className }: { plate: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border-2 border-foreground/70 bg-background px-2 py-0.5 font-mono text-xs font-bold tracking-wider whitespace-nowrap",
        className
      )}
    >
      {plate || "—"}
    </span>
  )
}
