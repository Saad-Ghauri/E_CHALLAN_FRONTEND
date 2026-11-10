"use client"

import Link from "next/link"
import { AlertTriangleIcon, BanknoteIcon, FileTextIcon, ScaleIcon, ScanSearchIcon, VideoIcon, WalletIcon } from "lucide-react"

import { RecentChallans } from "@/components/dashboard/recent-challans"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { ViolationsChart } from "@/components/dashboard/violations-chart"
import { useAuth } from "@/components/providers/auth-provider"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/use-api"
import { formatCurrency } from "@/lib/format"
import type { DashboardStats } from "@/lib/types"

function AttentionStrip({ items }: { items: { show: boolean; href: string; icon: typeof ScaleIcon; text: string }[] }) {
  const visible = items.filter((item) => item.show)
  if (!visible.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map(({ href, icon: Icon, text }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 rounded-full border bg-amber-500/10 px-3 py-1.5 text-sm text-amber-800 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
        >
          <Icon className="size-4" /> {text}
        </Link>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const { data, loading } = useApi<DashboardStats>("/dashboard/stats/")
  const totals = data?.totals

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${user?.first_name || "Officer"}`}
        description="Live overview of violations, collections and AI detections."
        actions={
          <Button asChild>
            <Link href="/dashboard/detect">
              <ScanSearchIcon /> New detection
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total challans"
          value={totals?.challans ?? 0}
          hint={`${totals?.challans_today ?? 0} issued today`}
          icon={FileTextIcon}
          loading={loading}
        />
        <StatCard
          label="Outstanding fines"
          value={formatCurrency(totals?.unpaid_amount ?? 0)}
          hint={`${totals?.unpaid_count ?? 0} unpaid challans`}
          icon={WalletIcon}
          tone="warning"
          loading={loading}
        />
        <StatCard
          label="Collected"
          value={formatCurrency(totals?.collected_amount ?? 0)}
          hint="From paid challans"
          icon={BanknoteIcon}
          tone="success"
          loading={loading}
        />
        <StatCard
          label="Overdue"
          value={totals?.overdue_count ?? 0}
          hint={`${totals?.needs_review ?? 0} detections need review`}
          icon={AlertTriangleIcon}
          tone="danger"
          loading={loading}
        />
      </div>

      <AttentionStrip
        items={[
          { show: isAdmin && (totals?.pending_appeals ?? 0) > 0, href: "/dashboard/appeals", icon: ScaleIcon, text: `${totals?.pending_appeals} appeal(s) waiting for a decision` },
          { show: (totals?.video_events_new ?? 0) > 0, href: "/dashboard/video", icon: VideoIcon, text: `${totals?.video_events_new} video event(s) to review` },
          { show: (totals?.needs_review ?? 0) > 0, href: "/dashboard/detections", icon: ScanSearchIcon, text: `${totals?.needs_review} detection(s) need plate review` },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TrendChart trend={data?.trend} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <ViolationsChart data={data?.violations_breakdown} loading={loading} />
        </div>
      </div>

      <RecentChallans challans={data?.recent_challans} loading={loading} />
    </PageContainer>
  )
}
