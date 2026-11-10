import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { CitizenSignupForm } from "@/components/auth/citizen-signup-form"

export const metadata: Metadata = { title: "Create an account" }

export default function SignupPage() {
  return (
    <AuthShell>
      <CitizenSignupForm />
    </AuthShell>
  )
}
