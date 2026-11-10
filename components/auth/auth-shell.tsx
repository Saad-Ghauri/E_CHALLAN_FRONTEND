"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2Icon, ScanLineIcon, ShieldCheckIcon, ZapIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { AuthDecor } from "@/components/auth/auth-decor"
import { Brand } from "@/components/shared/brand"
import { Card, CardContent } from "@/components/ui/card"
import { homeFor } from "@/lib/routes"

const HIGHLIGHTS = [
  { icon: ScanLineIcon, text: "Plate recognition from photos and video" },
  { icon: ZapIcon, text: "Violations detected and challans issued in seconds" },
  { icon: ShieldCheckIcon, text: "Complete, auditable challan history" },
]

/** Split-screen layout shared by the login and signup pages. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (user) router.replace(homeFor(user))
  }, [user, router])

  if (loading || user) {
    return (
      <div className="flex min-h-svh items-center justify-center text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center p-4 md:p-10">
      <AuthDecor />
      <Card className="rise-in relative w-full max-w-4xl overflow-hidden rounded-3xl p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col gap-8 p-6 md:p-10">
            <Link href="/" aria-label="Back to home" className="w-fit">
              <Brand />
            </Link>
            {children}
          </div>
          <div className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 p-10 text-white md:flex">
            <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold tracking-wide uppercase text-white/75">Smart Challan</p>
              <h2 className="mt-3 font-heading text-3xl leading-tight font-bold text-balance">
                Traffic enforcement, powered by number plate recognition.
              </h2>
            </div>
            <ul className="relative space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 text-sm ring-1 ring-white/15 backdrop-blur">
                  <span className="rounded-lg bg-white/20 p-2">
                    <Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
