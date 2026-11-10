import type { Metadata } from "next"
import Link from "next/link"
import {
  BellRingIcon,
  CreditCardIcon,
  FileSearchIcon,
  GavelIcon,
  ScanSearchIcon,
  ShieldAlertIcon,
  VideoIcon,
} from "lucide-react"

import { ChallanLookup } from "@/components/public/challan-lookup"
import { PublicHeader } from "@/components/public/public-header"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Smart Challan - traffic challans made clear" }

const CITIZEN_FEATURES = [
  { icon: FileSearchIcon, title: "See every challan", text: "Check by number plate or challan number. No account needed." },
  { icon: CreditCardIcon, title: "Pay online", text: "Settle a challan in a few clicks and keep the receipt." },
  { icon: GavelIcon, title: "Appeal if it's wrong", text: "Send your reason and proof. An administrator reviews it." },
  { icon: BellRingIcon, title: "Stay informed", text: "Get a notification the moment a challan is issued to your vehicle." },
]

const POLICE_FEATURES = [
  { icon: ScanSearchIcon, title: "Plate recognition", text: "Photos in, verified plate and owner out - with the evidence image." },
  { icon: VideoIcon, title: "Video analysis", text: "Tracks vehicles and flags wrong-way driving, illegal parking, triple riding and red-light running." },
]

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldAlertIcon className="size-3.5 text-primary" /> Smart Traffic Challan System
            </span>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
              Traffic challans, made clear and fair.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Look up a challan, pay it online or appeal it. Behind the scenes, AI reads number plates from photos and video so officers can
              act on evidence, not guesswork.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Officer sign in</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
            <h2 className="mb-1 text-lg font-semibold">Check a challan</h2>
            <p className="mb-4 text-sm text-muted-foreground">Enter your number plate or the challan number.</p>
            <ChallanLookup />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">For citizens</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CITIZEN_FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">For traffic police</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {POLICE_FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-xl border bg-card p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Smart Traffic Challan System · Final Year Project · Virtual University of Pakistan
      </footer>
    </div>
  )
}
