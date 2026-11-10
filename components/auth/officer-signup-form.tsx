"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2Icon, Loader2Icon } from "lucide-react"

import { FormField } from "@/components/shared/form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useForm } from "@/hooks/use-form"

export function OfficerSignupForm() {
  const [done, setDone] = React.useState(false)
  const form = useForm({
    first_name: "",
    last_name: "",
    email: "",
    badge_number: "",
    password: "",
  })

  const onSubmit = form.submit(async (values) => {
    await api.post("/auth/register/", values)
    setDone(true)
  })

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2Icon className="size-10 text-emerald-500" />
        <h1 className="text-xl font-semibold">Request submitted</h1>
        <p className="text-sm text-muted-foreground">
          An administrator needs to approve your account before you can sign in.
        </p>
        <Button asChild variant="outline">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Request an account</h1>
        <p className="text-sm text-muted-foreground">Officer accounts are activated by an administrator.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" htmlFor="first_name" error={form.errors.first_name}>
          <Input {...form.bind("first_name")} required />
        </FormField>
        <FormField label="Last name" htmlFor="last_name" error={form.errors.last_name}>
          <Input {...form.bind("last_name")} required />
        </FormField>
      </div>
      <FormField label="Email" htmlFor="email" error={form.errors.email}>
        <Input {...form.bind("email")} type="email" autoComplete="email" required />
      </FormField>
      <FormField label="Badge number" htmlFor="badge_number" error={form.errors.badge_number}>
        <Input {...form.bind("badge_number")} placeholder="TP-1024" />
      </FormField>
      <FormField label="Password" htmlFor="password" error={form.errors.password} hint="At least 8 characters.">
        <Input {...form.bind("password")} type="password" autoComplete="new-password" required />
      </FormField>

      <Button type="submit" size="lg" disabled={form.submitting}>
        {form.submitting && <Loader2Icon className="animate-spin" />}
        Submit request
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already approved?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
