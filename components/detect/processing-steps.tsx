"use client"

import * as React from "react"
import { CheckIcon, Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const STEPS = ["Detecting vehicle", "Locating number plate", "Reading characters (OCR)", "Cleaning & verifying text"]
const STEP_MS = 1400

/** Visual feedback while the backend pipeline runs (steps advance on a timer). */
export function ProcessingSteps() {
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => setActive((step) => Math.min(step + 1, STEPS.length - 1)), STEP_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <ol className="space-y-3 rounded-xl border bg-muted/30 p-4" aria-live="polite">
      {STEPS.map((label, index) => {
        const done = index < active
        const current = index === active
        return (
          <li key={label} className={cn("flex items-center gap-3 text-sm", !done && !current && "text-muted-foreground")}>
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-primary text-primary"
              )}
            >
              {done ? <CheckIcon className="size-3" /> : current ? <Loader2Icon className="size-3 animate-spin" /> : null}
            </span>
            {label}
          </li>
        )
      })}
    </ol>
  )
}
