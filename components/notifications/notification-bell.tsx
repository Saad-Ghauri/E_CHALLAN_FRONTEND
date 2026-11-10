"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BellIcon, CheckCheckIcon } from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/hooks/use-api"
import { api } from "@/lib/api"
import { timeAgo } from "@/lib/format"
import type { NotificationItem, Paginated } from "@/lib/types"
import { cn } from "@/lib/utils"

const POLL_MS = 30_000
const SHOWN = 8

/** Bell with an unread badge; the list loads when it is opened. Works for staff and citizens. */
export function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const unread = useApi<{ unread: number }>("/notifications/unread-count/", undefined, { refreshMs: POLL_MS })
  const list = useApi<Paginated<NotificationItem>>(open ? "/notifications/" : null, { page_size: SHOWN })
  const count = unread.data?.unread ?? 0

  const openItem = async (item: NotificationItem) => {
    if (!item.is_read) {
      await api.post(`/notifications/${item.id}/read/`)
      void unread.refetch()
    }
    if (item.link) router.push(item.link)
  }

  const markAll = async () => {
    await api.post("/notifications/read-all/")
    void unread.refetch()
    void list.refetch()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <IconTooltip label="Notifications">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${count ? ` (${count} unread)` : ""}`}>
            <BellIcon />
            {count > 0 && (
              <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-4 font-semibold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
      </IconTooltip>
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {count > 0 && (
            <button type="button" onClick={markAll} className="flex items-center gap-1 text-xs font-normal text-primary hover:underline">
              <CheckCheckIcon className="size-3" /> Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {list.loading && <Skeleton className="m-2 h-12" />}
        {!list.loading && list.data?.results.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
        )}
        {list.data?.results.map((item) => (
          <DropdownMenuItem key={item.id} onClick={() => openItem(item)} className="flex-col items-start gap-0.5 py-2">
            <span className={cn("flex w-full items-center gap-2 text-sm", !item.is_read && "font-semibold")}>
              {!item.is_read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
              {item.title}
            </span>
            <span className="line-clamp-2 text-xs text-muted-foreground">{item.message}</span>
            <span className="text-[11px] text-muted-foreground/80">{timeAgo(item.created_at)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
