"use client"

import { usePathname } from "next/navigation"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { NotificationBell } from "@/components/notifications/notification-bell"
import { IconTooltip } from "@/components/shared/icon-tooltip"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { titleForPath } from "@/lib/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 glass-bar">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h2 className="text-base font-medium">{titleForPath(pathname)}</h2>
        <div className="ml-auto flex items-center gap-1">
          <NotificationBell />
          <IconTooltip label="Switch light or dark theme"><Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Switch light or dark theme"
          >
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="dark:hidden" />
          </Button></IconTooltip>
        </div>
      </div>
    </header>
  )
}
