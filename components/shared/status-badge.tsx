import {
  AlertTriangleIcon,
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  XCircleIcon,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Challan, DetectionStatus } from "@/lib/types"

type StatusKey = Challan["status"] | "overdue" | DetectionStatus

const TONES = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
} as const

const STATUSES: Record<StatusKey, { label: string; tone: keyof typeof TONES; icon: LucideIcon }> = {
  paid: { label: "Paid", tone: "success", icon: CheckCircle2Icon },
  unpaid: { label: "Unpaid", tone: "warning", icon: ClockIcon },
  overdue: { label: "Overdue", tone: "danger", icon: AlertTriangleIcon },
  cancelled: { label: "Cancelled", tone: "muted", icon: BanIcon },
  completed: { label: "Plate verified", tone: "success", icon: CheckCircle2Icon },
  needs_review: { label: "Needs review", tone: "warning", icon: EyeIcon },
  failed: { label: "Failed", tone: "danger", icon: XCircleIcon },
}

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
  const { label, tone, icon: Icon } = STATUSES[status]
  return (
    <Badge className={cn("gap-1", TONES[tone], className)}>
      <Icon />
      {label}
    </Badge>
  )
}

/** Challans show "overdue" instead of "unpaid" once past the due date. */
export const challanStatus = (challan: Pick<Challan, "status" | "is_overdue">): StatusKey =>
  challan.is_overdue ? "overdue" : challan.status
