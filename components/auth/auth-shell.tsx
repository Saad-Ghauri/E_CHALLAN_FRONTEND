"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon, ScanLineIcon, ShieldCheckIcon, ZapIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
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
    <div className="flex min-h-svh items-center justify-center bg-muted p-4 md:p-10">
      <Card className="w-full max-w-4xl overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-10">{children}</div>
          <div className="relative hidden flex-col justify-between gap-10 bg-primary p-10 text-primary-foreground md:flex">
            <div>
              <p className="text-sm font-medium tracking-wide uppercase opacity-80">Smart Challan</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">
                Traffic enforcement, powered by number plate recognition.
              </h2>
            </div>
            <ul className="space-y-4">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="rounded-lg bg-primary-foreground/15 p-2">
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
