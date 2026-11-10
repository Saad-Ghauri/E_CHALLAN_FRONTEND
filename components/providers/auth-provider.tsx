"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { api, AUTH_EXPIRED_EVENT, tokenStore } from "@/lib/api"
import type { User } from "@/lib/types"

type AuthContextValue = {
  user: User | null
  /** true until the stored session has been checked */
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!tokenStore.access) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }
    api
      .get<User>("/auth/me/")
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false))
  }, [])

  const logout = React.useCallback(() => {
    tokenStore.clear()
    setUser(null)
    router.replace("/login")
  }, [router])

  React.useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout)
  }, [logout])

  const login = React.useCallback(async (email: string, password: string) => {
    const data = await api.post<{ access: string; refresh: string; user: User }>("/auth/login/", { email, password })
    tokenStore.set(data.access, data.refresh)
    setUser(data.user)
    return data.user
  }, [])

  const value = React.useMemo(
    () => ({ user, loading, isAdmin: user?.role === "admin", login, logout, setUser }),
    [user, loading, login, logout]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>")
  return context
}
