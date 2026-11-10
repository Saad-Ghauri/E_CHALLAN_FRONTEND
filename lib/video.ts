import { ArrowLeftRightIcon, BikeIcon, ParkingCircleIcon, SirenIcon, type LucideIcon } from "lucide-react"

import type { FlowDirection, VideoConfig, VideoEventType } from "@/lib/types"

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  wrong_way: { enabled: true, direction: "down" },
  illegal_parking: { enabled: true, seconds: 10, zone: null },
  triple_riding: { enabled: true },
  red_light: { enabled: false, stop_line: 0.6 },
}

export const FLOW_OPTIONS: { value: FlowDirection; label: string }[] = [
  { value: "down", label: "Towards the bottom of the picture ↓" },
  { value: "up", label: "Towards the top of the picture ↑" },
  { value: "right", label: "Left to right →" },
  { value: "left", label: "Right to left ←" },
]

/** Icon and colours for each kind of detected event (used on cards and the timeline). */
export const EVENT_META: Record<VideoEventType, { label: string; icon: LucideIcon; dot: string; chip: string }> = {
  wrong_way: { label: "Wrong way", icon: ArrowLeftRightIcon, dot: "bg-red-500", chip: "bg-red-500/10 text-red-700 dark:text-red-400" },
  illegal_parking: { label: "Illegal parking", icon: ParkingCircleIcon, dot: "bg-amber-500", chip: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  triple_riding: { label: "Triple riding", icon: BikeIcon, dot: "bg-violet-500", chip: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
  red_light: { label: "Red light", icon: SirenIcon, dot: "bg-rose-600", chip: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
}
