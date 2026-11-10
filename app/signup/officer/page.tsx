import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { OfficerSignupForm } from "@/components/auth/officer-signup-form"

export const metadata: Metadata = { title: "Request staff access" }

export default function OfficerSignupPage() {
  return (
    <AuthShell>
      <OfficerSignupForm />
    </AuthShell>
  )
}
