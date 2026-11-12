import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  BellRingIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  FileSearchIcon,
  GavelIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  UploadCloudIcon,
  VideoIcon,
} from "lucide-react"

import { DetectionScene } from "@/components/public/detection-scene"
import { ChallanLookup } from "@/components/public/challan-lookup"
import { PublicHeader } from "@/components/public/public-header"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Smart Challan - traffic challans made clear" }

const STEPS = [
  { icon: UploadCloudIcon, title: "Capture", text: "An officer uploads a photo or a traffic video from a fixed camera." },
  { icon: ScanSearchIcon, title: "Detect", text: "AI tracks vehicles, reads the number plate and proposes violations with evidence." },
  { icon: ShieldCheckIcon, title: "Resolve", text: "A human reviews, issues the challan, and the owner can pay or appeal online." },
]

const CITIZEN_FEATURES = [
  { icon: FileSearchIcon, title: "See every challan", text: "Look up by number plate or challan number. No account needed." },
  { icon: CreditCardIcon, title: "Pay online", text: "Settle a challan in a few clicks and keep the receipt." },
  { icon: GavelIcon, title: "Appeal if it's wrong", text: "Send your reason and proof. An administrator reviews it." },
  { icon: BellRingIcon, title: "Stay informed", text: "A notification arrives the moment a challan is issued to your vehicle." },
]

const DETECTORS = ["Wrong-way driving", "Red-light running", "Illegal parking", "Triple riding"]

const FACTS = [
  { value: "Photo + video", label: "plate recognition input" },
  { value: "4", label: "violations detected in video" },
  { value: "Citizen + officer", label: "separate areas, one system" },
  { value: "Officer review", label: "before a challan is issued" },
]

export default function HomePage() {
  return (
    <div className="min-h-svh">
      <PublicHeader />

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="rise-in flex flex-col gap-6">
            <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" /> AI plate recognition + video analytics
            </span>
            <h1 className="font-heading text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Traffic challans, <span className="text-brand">clear</span> and fair for everyone.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Look up a challan, pay it online or appeal it with evidence. Behind the scenes, AI reads number plates from photos and video, so
              officers act on proof, not guesswork.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-5 text-base">
                <Link href="/signup">
                  Create free account <ArrowRightIcon />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5 text-base">
                <Link href="/login">Officer sign in</Link>
              </Button>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["No account needed to check", "Every challan reviewed by an officer", "Audit log of actions"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2Icon className="size-4 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col items-center gap-5 lg:items-end">
            <div className="glass rise-in w-full max-w-md rounded-3xl p-6" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-lg font-bold">Check a challan</h2>
              <p className="mb-4 text-sm text-muted-foreground">Enter your number plate or the challan number.</p>
              <ChallanLookup />
            </div>
            <div className="hidden w-full justify-start sm:flex lg:mr-10 lg:justify-start">
              <DetectionScene />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="glass grid grid-cols-2 divide-x divide-border rounded-2xl py-5 md:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="px-5 py-2 text-center">
              <p className="font-heading text-xl font-extrabold text-brand sm:text-2xl">{f.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">How it works</p>
        <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold tracking-tight text-balance">From the road to a resolved challan in three steps</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="glass relative rounded-2xl p-6">
              <span className="absolute top-5 right-6 font-heading text-5xl font-extrabold text-primary/10">{i + 1}</span>
              <div className="btn-glow mb-4 flex size-11 items-center justify-center rounded-xl text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">For citizens</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">Your challans, in your hands</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CITIZEN_FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="glass grid items-center gap-8 rounded-3xl p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">For traffic police</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance">Video analysis that proposes, officers decide</h2>
            <p className="mt-3 text-muted-foreground">
              Upload a clip, draw the traffic direction, stop line or parking zone, and the system tracks every vehicle. Each proposed violation comes with
              an evidence snapshot and a plate read the officer can correct before issuing the challan.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {DETECTORS.map((d) => (
                <span key={d} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {d}
                </span>
              ))}
            </div>
            <Button asChild className="mt-7 h-10 px-4">
              <Link href="/login">
                <VideoIcon /> Open officer console
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 text-sm">
            {[
              ["Plate recognition", "Photos in, verified plate and owner out, with the evidence image."],
              ["Automatic rules", "Repeat offenders and fines are applied consistently."],
              ["Reports and CSV", "Violations and locations over time, ready to export."],
              ["Audit log", "Who issued, cancelled or decided what, and when."],
            ].map(([t, d]) => (
              <div key={t} className="flex gap-3 rounded-xl bg-background/50 p-4 ring-1 ring-border">
                <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Smart Traffic Challan System · Final Year Project · Virtual University of Pakistan
      </footer>
    </div>
  )
}
