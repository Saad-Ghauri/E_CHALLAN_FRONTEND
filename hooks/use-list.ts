"use client"

import * as React from "react"

import { useApi } from "@/hooks/use-api"
import { useDebounce } from "@/hooks/use-debounce"
import type { Paginated } from "@/lib/types"

const ALL = "all"

/** Paginated, searchable, filterable list backed by a DRF endpoint. */
export function useList<T>(path: string, initialFilters: Record<string, string> = {}) {
  const [page, setPage] = React.useState(1)
  const [search, setSearchState] = React.useState("")
  const [filters, setFilters] = React.useState(initialFilters)
  const debouncedSearch = useDebounce(search)

  const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ALL))
  const { data, loading, error, refetch } = useApi<Paginated<T>>(path, {
    page,
    search: debouncedSearch,
    ...activeFilters,
  })

  const setSearch = (value: string) => {
    setSearchState(value)
    setPage(1)
  }
  const setFilter = (name: string, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }

  return {
    items: data?.results ?? [],
    count: data?.count ?? 0,
    pageCount: data ? Math.max(1, Math.ceil(data.count / 10)) : 1,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilter,
    loading,
    error,
    refetch,
  }
}
