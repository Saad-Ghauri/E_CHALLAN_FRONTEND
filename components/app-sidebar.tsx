"use client"

import * as React from "react"
import Link from "next/link"

import { useAuth } from "@/components/providers/auth-provider"
import { Brand } from "@/components/shared/brand"
import { NavGroup } from "@/components/nav-group"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NAV_SECTIONS, SETTINGS_ITEM } from "@/lib/navigation"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard">
                <Brand />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_SECTIONS.filter((section) => isAdmin || !section.adminOnly).map((section) => (
          <NavGroup key={section.label ?? "main"} label={section.label} items={section.items} />
        ))}
        <NavGroup items={[SETTINGS_ITEM]} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
