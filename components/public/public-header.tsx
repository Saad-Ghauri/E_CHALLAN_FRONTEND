"use client"

import Link from "next/link"

import { useAuth } from "@/components/providers/auth-provider"
import { Brand } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"
import { homeFor } from "@/lib/routes"

/** Top bar of the public pages (home, check challan). */
export function PublicHeader() {
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-30 glass-bar">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" aria-label="Smart Challan home">
          <Brand />
        </Link>
        <nav className="ml-4 hidden items-center gap-1 text-sm sm:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/check">Check a challan</Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!loading && user ? (
            <Button asChild size="sm">
              <Link href={homeFor(user)}>Open my account</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
