import { ShieldCheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** The product logo: gradient tile + name. One place, used by every header. */
export function Brand({ className, hideNameOnMobile }: { className?: string; hideNameOnMobile?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5 font-heading font-bold tracking-tight", className)}>
      <span className="btn-glow flex size-8 items-center justify-center rounded-xl text-primary-foreground">
        <ShieldCheckIcon className="size-4.5" />
      </span>
      <span className={cn(hideNameOnMobile && "hidden sm:inline")}>Smart Challan</span>
    </span>
  )
}
