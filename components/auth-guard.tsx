"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon, ShieldOffIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { EmptyState } from "@/components/shared/empty-state"

/** Redirects anonymous visitors to /login; optionally restricts to administrators. */
export function AuthGuard({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode
  adminOnly?: boolean
}) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, user, router])

  if (loading || !user) {
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
