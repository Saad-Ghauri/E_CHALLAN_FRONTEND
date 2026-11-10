"use client"

import * as React from "react"

import { api, buildUrl, ApiError } from "@/lib/api"

type Params = Record<string, string | number | boolean | null | undefined>

type Options<T> = {
  /** Re-fetch every N ms; a function can stop polling by returning false (e.g. when a job has finished). */
  refreshMs?: number | false | ((data: T | null) => number | false)
}

/** GET a resource and keep loading / error state. Pass `null` as path to skip. */
export function useApi<T>(path: string | null, params?: Params, options: Options<T> = {}) {
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

  const interval = typeof options.refreshMs === "function" ? options.refreshMs(data) : options.refreshMs
  React.useEffect(() => {
    if (!interval || !url) return
    const timer = setInterval(() => void refetch(), interval)
    return () => clearInterval(timer)
  }, [interval, url, refetch])

  return { data, error, loading, refetch, setData }
}
