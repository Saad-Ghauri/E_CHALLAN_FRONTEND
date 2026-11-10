import Link from "next/link"
import { ArrowRightIcon, FileTextIcon } from "lucide-react"

import { PlateBadge } from "@/components/shared/plate-badge"
import { challanStatus, StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Challan } from "@/lib/types"

export function RecentChallans({ challans, loading }: { challans?: Challan[]; loading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent challans</CardTitle>
        <CardDescription>Latest violations issued across the city</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/challans">
              View all <ArrowRightIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {loading || !challans ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : challans.length === 0 ? (
          <EmptyState icon={FileTextIcon} title="No challans yet" description="Issued challans will show up here." />
        ) : (
          <ul className="divide-y">
            {challans.map((challan) => (
              <li key={challan.id}>
                <Link
                  href={`/dashboard/challans/${challan.id}`}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/50 sm:px-2"
                >
                  <PlateBadge plate={challan.plate_number} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {challan.items.map((item) => item.name).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(challan.issued_at)}</p>
                  </div>
                  <span className="hidden text-sm font-medium tabular-nums sm:block">
                    {formatCurrency(challan.total_fine)}
                  </span>
                  <StatusBadge status={challanStatus(challan)} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
