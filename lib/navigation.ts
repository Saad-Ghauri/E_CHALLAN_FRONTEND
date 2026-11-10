import {
  CarIcon,
  ChartBarIcon,
  FileTextIcon,
  GavelIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ScaleIcon,
  ScanSearchIcon,
  ScrollTextIcon,
  Settings2Icon,
  UsersIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react"

export type NavItem = { title: string; url: string; icon: LucideIcon }
export type NavSection = { label?: string; items: NavItem[]; adminOnly?: boolean }

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
      { title: "Detect & Issue", url: "/dashboard/detect", icon: ScanSearchIcon },
      { title: "Video Analysis", url: "/dashboard/video", icon: VideoIcon },
    ],
  },
  {
    label: "Records",
    items: [
      { title: "Challans", url: "/dashboard/challans", icon: FileTextIcon },
      { title: "Vehicles", url: "/dashboard/vehicles", icon: CarIcon },
      { title: "Detection Logs", url: "/dashboard/detections", icon: HistoryIcon },
      { title: "Reports", url: "/dashboard/reports", icon: ChartBarIcon },
    ],
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [
      { title: "Violation Types", url: "/dashboard/violations", icon: GavelIcon },
      { title: "Appeals", url: "/dashboard/appeals", icon: ScaleIcon },
      { title: "Users", url: "/dashboard/users", icon: UsersIcon },
      { title: "Audit Log", url: "/dashboard/audit", icon: ScrollTextIcon },
    ],
  },
]

export const SETTINGS_ITEM: NavItem = { title: "Settings", url: "/dashboard/settings", icon: Settings2Icon }

const ALL_ITEMS = [...NAV_SECTIONS.flatMap((section) => section.items), SETTINGS_ITEM]

/** Title for the current path (longest matching nav url wins). */
export function titleForPath(pathname: string) {
  const match = ALL_ITEMS.filter(
    (item) => pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(`${item.url}/`))
  ).sort((a, b) => b.url.length - a.url.length)[0]
  return match?.title ?? "Dashboard"
}

export function isActivePath(pathname: string, url: string) {
  return url === "/dashboard" ? pathname === url : pathname === url || pathname.startsWith(`${url}/`)
}
