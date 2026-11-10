"use client"

import { useApi } from "@/hooks/use-api"
import type { Paginated, ViolationType } from "@/lib/types"

/** All active violation types (the catalogue is small, so one page is enough). */
export function useViolationTypes() {
  const { data, loading } = useApi<Paginated<ViolationType>>("/violation-types/", {
    is_active: true,
    page_size: 100,
  })
  return { violationTypes: data?.results ?? [], loading }
}
