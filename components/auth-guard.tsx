"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon, ShieldOffIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { homeFor } from "@/lib/routes"

/**
 * Keeps each kind of user in their own area:
 * anonymous visitors go to /login, citizens and police staff are sent to their own home,
 * and `adminOnly` pages show a message to officers.
 */
export function AuthGuard({
  children,
  area = "staff",
  adminOnly = false,
}: {
  children: React.ReactNode
  area?: "staff" | "citizen"
  adminOnly?: boolean
}) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const wrongArea = Boolean(user) && (area === "citizen") !== (user?.role === "citizen")

  React.useEffect(() => {
    if (loading) return
    if (!user) router.replace("/login")
    else if (wrongArea) router.replace(homeFor(user))
  }, [loading, user, wrongArea, router])

  if (loading || !user || wrongArea) {
    return (
      <div className="flex min-h-svh items-center justify-center text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" />
      </div>
    )
  }

  if (adminOnly && !isAdmin) {
    return (
      <EmptyState
        icon={ShieldOffIcon}
        title="Administrators only"
        description="You don't have permission to view this page."
        className="m-6"
      />
    )
  }

  return <>{children}</>
}
