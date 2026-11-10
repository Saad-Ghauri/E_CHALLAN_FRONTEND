import { BellRingIcon, CheckCircle2Icon, ScanLineIcon, ShieldCheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Floating glass chips and orbs behind the auth card: depth without clutter. Hidden on small screens. */
const CHIPS = [
  { text: "LEA-1234", icon: ScanLineIcon, mono: true, pos: "top-[14%] left-[2%]", delay: "0s" },
  { text: "Challan paid", icon: CheckCircle2Icon, pos: "top-[22%] right-[2%]", delay: "1.2s" },
  { text: "Appeal accepted", icon: ShieldCheckIcon, pos: "bottom-[18%] left-[2%]", delay: "2.1s" },
  { text: "New challan issued", icon: BellRingIcon, pos: "bottom-[12%] right-[2%]", delay: "0.6s" },
]

export function AuthDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block" aria-hidden>
      <div className="absolute -top-32 left-[18%] size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-400/20 blur-3xl" />
      {CHIPS.map(({ text, icon: Icon, mono, pos, delay }) => (
        <div
          key={text}
          className={cn("glass float-slow absolute flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium", pos)}
          style={{ animationDelay: delay }}
        >
          <Icon className="size-3.5 text-primary" />
          <span className={cn(mono && "font-mono font-bold tracking-wider")}>{text}</span>
        </div>
      ))}
    </div>
  )
}
