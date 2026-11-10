"use client"

import * as React from "react"

import { api, buildUrl, ApiError } from "@/lib/api"

type Params = Record<string, string | number | boolean | null | undefined>

/** GET a resource and keep loading / error state. Pass `null` as path to skip. */
export function useApi<T>(path: string | null, params?: Params) {
  const url = path ? buildUrl(path, params) : null
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<ApiError | null>(null)
  const [loading, setLoading] = React.useState(Boolean(url))
  const latest = React.useRef(0)

  const refetch = React.useCallback(async () => {
    if (!url) return
    const id = ++latest.current
    try {
      const result = await api.get<T>(url)
      if (id === latest.current) {
        setData(result)
        setError(null)
      }
    } catch (err) {
      if (id === latest.current) setError(err as ApiError)
    } finally {
      if (id === latest.current) setLoading(false)
    }
  }, [url])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch()
  }, [refetch])

  return { data, error, loading, refetch, setData }
}
