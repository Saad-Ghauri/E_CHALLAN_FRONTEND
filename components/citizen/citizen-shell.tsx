"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CarIcon, FileTextIcon, GavelIcon, HomeIcon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { useAuth } from "@/components/providers/auth-provider"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Brand } from "@/components/shared/brand"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconTooltip } from "@/components/shared/icon-tooltip"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/citizen", label: "Overview", icon: HomeIcon, exact: true },
  { href: "/citizen/challans", label: "My challans", icon: FileTextIcon },
  { href: "/citizen/vehicles", label: "My vehicles", icon: CarIcon },
  { href: "/citizen/appeals", label: "Appeals", icon: GavelIcon },
]

/** Header + navigation for the citizen portal (a simple top bar, unlike the officer sidebar). */
export function CitizenShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-30 glass-bar">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Link href="/citizen" aria-label="Smart Challan home">
            <Brand hideNameOnMobile />
          </Link>

          <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Button key={href} asChild variant="ghost" size="sm" className={cn(active && "bg-primary/10 font-semibold text-primary hover:bg-primary/15")}>
                  <Link href={href}>{label}</Link>
                </Button>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <IconTooltip label="Switch light or dark theme"><Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Switch light or dark theme">
              <SunIcon className="hidden dark:block" />
              <MoonIcon className="dark:hidden" />
            </Button></IconTooltip>
            <NotificationBell />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-1.5" aria-label="Account menu">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(user.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-32 truncate text-sm sm:inline">{user.first_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="truncate font-medium">{user.full_name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/check">Check any challan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t px-3 py-1.5 md:hidden" aria-label="Main (mobile)">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Button key={href} asChild variant="ghost" size="sm" className={cn("shrink-0", active && "bg-muted font-semibold")}>
                <Link href={href}>
                  <Icon /> {label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </header>

      <main className="rise-in mx-auto w-full max-w-5xl space-y-6 px-4 py-6">{children}</main>
    </div>
  )
}
