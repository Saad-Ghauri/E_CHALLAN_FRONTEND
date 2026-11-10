"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2Icon, PartyPopperIcon, SearchIcon } from "lucide-react"

import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { FilterTabs } from "@/components/shared/toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, ApiError } from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/format"
import type { PublicChallan } from "@/lib/types"

const MODES = [
  { value: "plate", label: "Number plate" },
  { value: "number", label: "Challan number" },
]

/** Anyone can check a plate or challan number - no account needed. Paying and appealing need one. */
export function ChallanLookup() {
  const [mode, setMode] = React.useState("plate")
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<PublicChallan[] | null>(null)
  const [loading, setLoading] = React.useState(false)

  const search = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      setResults(await api.get<PublicChallan[]>("/public/challans/", { [mode]: query.trim() }))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not check right now.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <FilterTabs value={mode} onChange={(value) => { setMode(value); setResults(null) }} options={MODES} />

      <form onSubmit={search} className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(mode === "plate" ? event.target.value.toUpperCase() : event.target.value)}
          placeholder={mode === "plate" ? "e.g. LEA-1234" : "e.g. CH-20261110-A1B2C3"}
          className="h-10 font-mono text-base tracking-wide"
          aria-label={mode === "plate" ? "Number plate" : "Challan number"}
          required
        />
        <Button type="submit" size="lg" className="h-10" disabled={loading || !query.trim()}>
          {loading ? <Loader2Icon className="animate-spin" /> : <SearchIcon />} Check
        </Button>
      </form>

      {results?.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
          <PartyPopperIcon className="size-5 shrink-0 text-emerald-600" />
          No challans found. You are all clear.
        </div>
      )}

      {results && results.length > 0 && (
        <>
          <ul className="space-y-2">
            {results.map((challan) => (
              <li key={challan.challan_number} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <PlateBadge plate={challan.plate_number} />
                    <span className="text-sm font-medium">{challan.challan_number}</span>
                  </div>
                  <StatusBadge status={challanStatus(challan)} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{challan.violations.join(", ")}</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Issued {formatDate(challan.issued_at)}
                    {challan.location && ` · ${challan.location}`} · Due {formatDate(challan.due_date)}
                  </span>
                  <span className="text-base font-semibold tabular-nums">{formatCurrency(challan.total_fine)}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            To pay a challan or submit an appeal,{" "}
            <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              create a free account
            </Link>{" "}
            or{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              sign in
            </Link>
            .
          </p>
        </>
      )}
    </div>
  )
}
