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
import { homeFor } from "@/lib/routes"

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const form = useForm({ email: "", password: "" })

  const onSubmit = form.submit(async ({ email, password }) => {
    router.replace(homeFor(await login(email, password)))
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to the Smart Challan system.</p>
      </div>

      <FormField label="Email" htmlFor="email" error={form.errors.email}>
        <Input {...form.bind("email")} type="email" autoComplete="email" placeholder="you@example.com" required />
      </FormField>
      <FormField label="Password" htmlFor="password" error={form.errors.password}>
        <PasswordInput {...form.bind("password")} autoComplete="current-password" required />
      </FormField>

      <Button type="submit" size="lg" disabled={form.submitting}>
        {form.submitting && <Loader2Icon className="animate-spin" />}
        Sign in
      </Button>

      <div className="space-y-1 text-center text-sm text-muted-foreground">
        <p>
          New here?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Create a citizen account
          </Link>
        </p>
        <p>
          Traffic officer?{" "}
          <Link href="/signup/officer" className="font-medium text-primary underline-offset-4 hover:underline">
            Request staff access
          </Link>
        </p>
      </div>
    </form>
  )
}
