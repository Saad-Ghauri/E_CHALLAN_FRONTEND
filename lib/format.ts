export const formatCurrency = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-PK")}`

export const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—"

export const formatDateTime = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

export const formatDay = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" })

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?"

/** "5 min ago", "3 h ago", "2 d ago" - falls back to a date after a week. */
export function timeAgo(value: string) {
  const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)} d ago`
  return formatDate(value)
}

/** 75 -> "1:15" for video timestamps. */
export function formatClock(seconds: number) {
  const whole = Math.max(0, Math.round(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

/** Input masks: format while the user types so they never have to think about dashes. */
export const formatCnic = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 13)
  return [d.slice(0, 5), d.slice(5, 12), d.slice(12)].filter(Boolean).join("-")
}

export const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 11)
  return [d.slice(0, 4), d.slice(4)].filter(Boolean).join("-")
}

export const formatPlate = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .replace(/^([A-Z]{3})(\d{1,4})$/, "$1-$2")
    .slice(0, 12)
