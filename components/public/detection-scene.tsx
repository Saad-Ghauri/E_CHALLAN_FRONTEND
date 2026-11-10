import Image from "next/image"
import { CheckCircle2Icon } from "lucide-react"

/**
 * Landing-page preview of the detection screen. The photo is real and the boxes and plate are what the
 * system's own pipeline returned for it (motorcycle 0.78, plate TN07CY3098 read at 94%), cropped to 767x575.
 */
const W = 767
const H = 575

const STEPS = ["Vehicle found", "Plate located", "Text read", "Owner matched"]

export function DetectionScene() {
  return (
    <div className="glass float-slow w-full max-w-md rounded-2xl p-3" aria-hidden>
      <div className="relative overflow-hidden rounded-xl bg-slate-900">
        <Image src="/images/hero-detection.jpg" alt="" width={W} height={H} priority className="block h-auto w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/25" />

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" role="presentation">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* vehicle box */}
          <rect x="212" y="44" width="468" height="540" rx="16" fill="none" stroke="#a78bfa" strokeWidth="3.5" filter="url(#glow)" />
          {[[212, 44, 1, 1], [680, 44, -1, 1]].map(([x, y, sx, sy]) => (
            <path key={x} d={`M${x} ${y + sy * 44} V${y} H${x + sx * 44}`} fill="none" stroke="#c4b5fd" strokeWidth="6" strokeLinecap="round" />
          ))}
          {/* plate box */}
          <rect x="407" y="299" width="96" height="77" rx="6" fill="none" stroke="#34d399" strokeWidth="3.5" filter="url(#glow)" />
        </svg>

        {/* labels sit above the SVG so text stays crisp at any width */}
        <span className="absolute top-[3%] left-[27.7%] rounded-md bg-violet-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg">
          Motorcycle 0.78
        </span>
        <span className="absolute top-[69%] left-[52%] flex items-center gap-1 rounded-md bg-emerald-400 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-emerald-950 shadow-lg">
          TN07CY3098 · 94%
        </span>

        <div className="absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-emerald-300/20 to-transparent" style={{ animation: "scan 3.4s ease-in-out infinite alternate" }} />

        <span className="glass-bar absolute top-3 left-3 flex items-center gap-1.5 rounded-full border-0 px-2.5 py-1 text-[10px] font-medium text-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> Live analysis
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 px-1">
        {STEPS.map((s) => (
          <span key={s} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CheckCircle2Icon className="size-3.5 text-emerald-500" /> {s}
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3 px-1 pb-0.5">
        <div>
          <p className="text-xs text-muted-foreground">Plate recognised</p>
          <p className="text-sm font-semibold">TN07CY3098 · 94% confidence</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Ready to verify</span>
      </div>
    </div>
  )
}
