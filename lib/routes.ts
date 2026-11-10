import type { User } from "@/lib/types"

/** Where each kind of user lands after signing in. */
export const homeFor = (user: Pick<User, "role">) => (user.role === "citizen" ? "/citizen" : "/dashboard")
