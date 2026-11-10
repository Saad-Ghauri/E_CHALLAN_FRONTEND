"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { FormField } from "@/components/shared/form-dialog"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/shared/password-input"
import { Input } from "@/components/ui/input"
import { useForm } from "@/hooks/use-form"
import { api } from "@/lib/api"
import { formatCnic, formatPhone } from "@/lib/format"

/** Citizens sign up and are signed in straight away (they only ever see their own data). */
export function CitizenSignupForm() {
  const { login } = useAuth()
  const router = useRouter()
  const form = useForm({ first_name: "", last_name: "", email: "", phone: "", cnic: "", password: "" })

  const onSubmit = form.submit(async (values) => {
    await api.post("/auth/register-citizen/", values)
    await login(values.email, values.password)
    router.replace("/citizen")
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Check, pay and appeal your traffic challans online.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" htmlFor="first_name" required error={form.errors.first_name}>
          <Input {...form.bind("first_name")} required />
        </FormField>
        <FormField label="Last name" htmlFor="last_name" required error={form.errors.last_name}>
          <Input {...form.bind("last_name")} required />
        </FormField>
      </div>
      <FormField label="Email" htmlFor="email" required error={form.errors.email}>
        <Input {...form.bind("email")} type="email" autoComplete="email" required />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="phone" error={form.errors.phone}>
          <Input {...form.bind("phone", formatPhone)} placeholder="0300-1234567" inputMode="tel" autoComplete="tel" />
        </FormField>
        <FormField label="CNIC" htmlFor="cnic" error={form.errors.cnic} hint="13 digits. Dashes are added for you. Used to verify your vehicles.">
          <Input {...form.bind("cnic", formatCnic)} placeholder="35202-1234567-1" inputMode="numeric" />
        </FormField>
      </div>
      <FormField label="Password" htmlFor="password" required error={form.errors.password} hint="At least 8 characters.">
        <PasswordInput {...form.bind("password")} autoComplete="new-password" required />
      </FormField>

      <Button type="submit" size="lg" disabled={form.submitting}>
        {form.submitting && <Loader2Icon className="animate-spin" />}
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
