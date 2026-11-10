const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
const ACCESS_KEY = "challan.access"
const REFRESH_KEY = "challan.refresh"

export const AUTH_EXPIRED_EVENT = "auth:expired"

type Params = Record<string, string | number | boolean | null | undefined>
type FieldErrors = Record<string, string[] | string>

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: FieldErrors = {}
  ) {
    super(message)
  }

  /** First message per field, ready to show under form inputs. */
  get fieldErrors(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.errors).map(([key, value]) => [
        key,
        Array.isArray(value) ? String(value[0]) : String(value),
      ])
    )
  }
}

export const tokenStore = {
  get access() {
    return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY)
  },
  get refresh() {
    return typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

export function buildUrl(path: string, params?: Params) {
  const query = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value))
    }
  })
  const qs = query.toString()
  return `${path}${qs ? `?${qs}` : ""}`
}

let refreshing: Promise<boolean> | null = null

/** Exchange the refresh token for a new access token (single in-flight call). */
function refreshAccessToken(): Promise<boolean> {
  refreshing ??= (async () => {
    const refresh = tokenStore.refresh
    if (!refresh) return false
    const res = await fetch(`${BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    tokenStore.set(data.access, data.refresh)
    return true
  })().finally(() => {
    refreshing = null
  })
  return refreshing
}

async function send(method: string, path: string, body?: unknown, params?: Params, retry = true): Promise<Response> {
  const headers: Record<string, string> = {}
  const isForm = body instanceof FormData
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json"
  if (tokenStore.access) headers.Authorization = `Bearer ${tokenStore.access}`

  const res = await fetch(`${BASE_URL}${buildUrl(path, params)}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })

  if (res.status === 401 && retry && tokenStore.refresh) {
    if (await refreshAccessToken()) return send(method, path, body, params, false)
    tokenStore.clear()
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
  }
  return res
}

async function toError(res: Response): Promise<ApiError> {
  const data = await res.json().catch(() => ({}))
  return new ApiError(data.detail ?? "Something went wrong. Please try again.", res.status, data.errors ?? {})
}

async function request<T>(method: string, path: string, body?: unknown, params?: Params): Promise<T> {
  const res = await send(method, path, body, params)
  if (!res.ok) throw await toError(res)
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const api = {
  get: <T>(path: string, params?: Params) => request<T>("GET", path, undefined, params),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body ?? {}),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: (path: string) => request<void>("DELETE", path),
  /** Authenticated file download (e.g. challan PDF) returned as an object URL. */
  async blobUrl(path: string): Promise<string> {
    const res = await send("GET", path)
    if (!res.ok) throw await toError(res)
    return URL.createObjectURL(await res.blob())
  },
}
