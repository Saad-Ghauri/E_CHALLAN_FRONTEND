import {
  AlertTriangleIcon,
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  FileCheck2Icon,
  Loader2Icon,
  SparklesIcon,
  XCircleIcon,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AppealStatus, Challan, DetectionStatus, VideoEventStatus, VideoJobStatus } from "@/lib/types"

type StatusKey = Challan["status"] | "overdue" | DetectionStatus | AppealStatus | VideoJobStatus | VideoEventStatus

const TONES = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  muted: "bg-muted text-muted-foreground",
} as const

const STATUSES: Record<StatusKey, { label: string; tone: keyof typeof TONES; icon: LucideIcon; spin?: boolean }> = {
  // challans
  paid: { label: "Paid", tone: "success", icon: CheckCircle2Icon },
  unpaid: { label: "Unpaid", tone: "warning", icon: ClockIcon },
  overdue: { label: "Overdue", tone: "danger", icon: AlertTriangleIcon },
  cancelled: { label: "Cancelled", tone: "muted", icon: BanIcon },
  // plate detections
  completed: { label: "Completed", tone: "success", icon: CheckCircle2Icon },
  needs_review: { label: "Needs review", tone: "warning", icon: EyeIcon },
  failed: { label: "Failed", tone: "danger", icon: XCircleIcon },
  // appeals
  pending: { label: "Pending review", tone: "warning", icon: ClockIcon },
  accepted: { label: "Accepted", tone: "success", icon: CheckCircle2Icon },
  rejected: { label: "Rejected", tone: "danger", icon: XCircleIcon },
  // video jobs and events
  queued: { label: "Queued", tone: "muted", icon: ClockIcon },
  processing: { label: "Processing", tone: "info", icon: Loader2Icon, spin: true },
  new: { label: "New", tone: "info", icon: SparklesIcon },
  challan_issued: { label: "Challan issued", tone: "success", icon: FileCheck2Icon },
  dismissed: { label: "Dismissed", tone: "muted", icon: BanIcon },
}

export function StatusBadge({ status, label, className }: { status: StatusKey; label?: string; className?: string }) {
  const { label: defaultLabel, tone, icon: Icon, spin } = STATUSES[status]
  return (
    <Badge className={cn("gap-1", TONES[tone], className)}>
      <Icon className={cn(spin && "animate-spin")} />
      {label ?? defaultLabel}
    </Badge>
  )
}

/** Challans show "overdue" instead of "unpaid" once past the due date. */
export const challanStatus = (challan: Pick<Challan, "status" | "is_overdue">): StatusKey =>
  challan.is_overdue ? "overdue" : challan.status
