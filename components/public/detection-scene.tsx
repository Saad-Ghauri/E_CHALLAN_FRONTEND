/**
 * Decorative "camera feed" for the landing page: a road in perspective, vehicles with detection boxes,
 * a tracking trail and a mini event timeline. Pure SVG + CSS, no images, aria-hidden.
 */

const EVENTS = [
  { at: "8%", color: "bg-emerald-400" },
  { at: "31%", color: "bg-amber-400" },
  { at: "54%", color: "bg-red-400" },
  { at: "78%", color: "bg-emerald-400" },
]

function Car({ x, y, w, color }: { x: number; y: number; w: number; color: string }) {
  return <use href="#car" x={x} y={y} width={w} height={w * 0.6} style={{ color }} />
}

export function DetectionScene() {
  return (
    <div className="glass float-slow w-full max-w-md rounded-2xl p-3" aria-hidden>
      <div className="relative overflow-hidden rounded-xl bg-slate-900">
        <svg viewBox="0 0 400 270" className="block w-full" role="presentation">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1e2a4a" />
              <stop offset="1" stopColor="#3b4f7a" />
            </linearGradient>
            <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a3144" />
              <stop offset="1" stopColor="#141a29" />
            </linearGradient>
            <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#34d399" stopOpacity="0" />
              <stop offset="0.5" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="1" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
            <symbol id="car" viewBox="0 0 100 60">
              <rect x="6" y="20" width="88" height="28" rx="9" fill="currentColor" />
              <path d="M20 20 L28 5 H72 L80 20 Z" fill="currentColor" />
              <path d="M26 19 L32 8 H68 L74 19 Z" fill="#a9bddb" opacity="0.85" />
              <rect x="9" y="29" width="14" height="6" rx="2" fill="#ff5a5a" />
              <rect x="77" y="29" width="14" height="6" rx="2" fill="#ff5a5a" />
              <rect x="38" y="33" width="24" height="9" rx="1.5" fill="#f5f7fb" />
              <rect x="10" y="45" width="15" height="9" rx="2" fill="#0b0f1a" />
              <rect x="75" y="45" width="15" height="9" rx="2" fill="#0b0f1a" />
            </symbol>
          </defs>

          {/* sky, skyline, road */}
          <rect width="400" height="270" fill="url(#sky)" />
          <g fill="#17203a" opacity="0.9">
            <rect x="12" y="62" width="30" height="48" />
            <rect x="46" y="76" width="24" height="34" />
            <rect x="74" y="54" width="20" height="56" />
            <rect x="300" y="68" width="26" height="42" />
            <rect x="330" y="52" width="32" height="58" />
            <rect x="366" y="74" width="26" height="36" />
          </g>
          <g fill="#0f1730">
            <rect x="96" y="82" width="6" height="28" />
            <circle cx="99" cy="80" r="9" />
            <rect x="262" y="84" width="5" height="26" />
            <circle cx="264" cy="82" r="8" />
          </g>
          <rect y="110" width="400" height="160" fill="#0e1424" />
          <polygon points="150,110 250,110 440,270 -40,270" fill="url(#road)" />
          <line x1="150" y1="110" x2="-40" y2="270" stroke="#dfe6f5" strokeOpacity="0.5" strokeWidth="2" />
          <line x1="250" y1="110" x2="440" y2="270" stroke="#dfe6f5" strokeOpacity="0.5" strokeWidth="2" />
          <line x1="183" y1="110" x2="108" y2="270" stroke="#dfe6f5" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="10 12" />
          <line x1="217" y1="110" x2="292" y2="270" stroke="#dfe6f5" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="10 12" />
          {/* stop line */}
          <line x1="104" y1="238" x2="296" y2="238" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 5" opacity="0.8" />

          {/* traffic signal */}
          <g>
            <rect x="344" y="94" width="6" height="40" fill="#0b1020" />
            <rect x="338" y="62" width="18" height="36" rx="4" fill="#0b1020" />
            <circle cx="347" cy="71" r="4" fill="#ef4444" />
            <circle cx="347" cy="81" r="4" fill="#3b4256" />
            <circle cx="347" cy="91" r="4" fill="#3b4256" />
          </g>

          {/* far vehicles drift slowly */}
          <g className="scene-drift">
            <Car x={176} y={118} w={26} color="#6f84a8" />
            <Car x={208} y={124} w={30} color="#a05a5a" />
          </g>
          <Car x={226} y={150} w={56} color="#4d6fb0" />

          {/* triple riding motorbike */}
          <g transform="translate(268 168)">
            <rect x="-2" y="-4" width="64" height="62" rx="6" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <rect x="-2" y="-16" width="62" height="13" rx="3" fill="#fbbf24" />
            <text x="3" y="-6" fontSize="8" fontWeight="700" fill="#1c1917">triple 0.91</text>
            <circle cx="14" cy="8" r="5.5" fill="#e6c9a8" />
            <circle cx="28" cy="4" r="5.5" fill="#e6c9a8" />
            <circle cx="42" cy="8" r="5.5" fill="#e6c9a8" />
            <rect x="9" y="13" width="10" height="20" rx="4" fill="#7c3aed" />
            <rect x="23" y="9" width="10" height="24" rx="4" fill="#0ea5e9" />
            <rect x="37" y="13" width="10" height="20" rx="4" fill="#f43f5e" />
            <rect x="8" y="33" width="42" height="9" rx="4" fill="#1f2937" />
            <circle cx="14" cy="48" r="7" fill="#0b0f1a" />
            <circle cx="44" cy="48" r="7" fill="#0b0f1a" />
          </g>

          {/* tracking trail + wrong-way car */}
          <path d="M96 232 C 100 212, 104 192, 110 168" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
          <polygon points="110,160 105,172 115,172" fill="#34d399" />
          <Car x={54} y={178} w={116} color="#d8dde8" />
          <g>
            <rect x="48" y="170" width="128" height="82" rx="6" fill="none" stroke="#34d399" strokeWidth="2.2" />
            <rect x="48" y="156" width="70" height="14" rx="3" fill="#34d399" />
            <text x="54" y="166.5" fontSize="9" fontWeight="700" fill="#052e1f">car 0.94 · #7</text>
            <rect x="104" y="257" width="56" height="12" rx="2" fill="#f8fafc" />
            <text x="132" y="266.5" fontSize="9" fontWeight="800" textAnchor="middle" fill="#0f172a" fontFamily="ui-monospace, monospace">LEA-1234</text>
          </g>

          {/* scan sweep */}
          <rect className="scene-scan" x="0" y="0" width="400" height="40" fill="url(#scan)" />

          {/* HUD */}
          <g fontFamily="ui-monospace, monospace" fontSize="9" fill="#e2e8f0">
            <rect x="8" y="8" width="104" height="17" rx="8.5" fill="#000" opacity="0.5" />
            <circle cx="20" cy="16.5" r="3" fill="#f87171" className="scene-blink" />
            <text x="28" y="19.5">REC · CAM-04</text>
            <rect x="288" y="8" width="104" height="17" rx="8.5" fill="#000" opacity="0.5" />
            <text x="296" y="19.5">14:32:08 · f214</text>
          </g>
          <g fontSize="9" fontWeight="700">
            <rect x="8" y="30" width="64" height="15" rx="4" fill="#ef4444" />
            <text x="14" y="40.5" fill="#fff">WRONG WAY</text>
          </g>
        </svg>
      </div>

      <div className="mt-3 px-1">
        <div className="relative h-1.5 rounded-full bg-muted">
          {EVENTS.map((e) => (
            <span key={e.at} className={`absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full ring-2 ring-card ${e.color}`} style={{ left: e.at }} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">4 events found in this clip</p>
            <p className="text-sm font-semibold">Wrong-way driving · LEA-1234</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Needs review</span>
        </div>
      </div>
    </div>
  )
}
