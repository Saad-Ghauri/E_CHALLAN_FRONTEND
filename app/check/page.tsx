import type { Metadata } from "next"

import { ChallanLookup } from "@/components/public/challan-lookup"
import { PublicHeader } from "@/components/public/public-header"

export const metadata: Metadata = { title: "Check a challan" }

export default function CheckChallanPage() {
  return (
    <div className="min-h-svh bg-muted/30">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Check a challan</h1>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">No account needed. Enter your number plate or the challan number.</p>
          <ChallanLookup />
        </div>
      </main>
    </div>
  )
}
