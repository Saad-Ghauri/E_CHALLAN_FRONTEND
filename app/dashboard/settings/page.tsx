"use client"

import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { FormField } from "@/components/shared/form-dialog"
import { PasswordInput } from "@/components/shared/password-input"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "@/hooks/use-form"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"

function ProfileCard({ user, onSaved }: { user: User; onSaved: (user: User) => void }) {
  const form = useForm({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    badge_number: user.badge_number,
  })

  const submit = form.submit(async (values) => {
    onSaved(await api.patch<User>("/auth/me/", values))
    toast.success("Profile updated.")
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" htmlFor="first_name" error={form.errors.first_name}>
            <Input {...form.bind("first_name")} required />
          </FormField>
          <FormField label="Last name" htmlFor="last_name" error={form.errors.last_name}>
            <Input {...form.bind("last_name")} required />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input {...form.bind("phone")} />
          </FormField>
          <FormField label="Badge number" htmlFor="badge_number">
            <Input {...form.bind("badge_number")} />
          </FormField>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={form.submitting}>
              {form.submitting && <Loader2Icon className="animate-spin" />} Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function PasswordCard() {
  const form = useForm({ old_password: "", new_password: "" })

  const submit = form.submit(async (values) => {
    await api.post("/auth/change-password/", values)
    toast.success("Password changed.")
    form.reset()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Use at least 8 characters.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <FormField label="Current password" htmlFor="old_password" error={form.errors.old_password}>
            <PasswordInput {...form.bind("old_password")} autoComplete="current-password" required />
          </FormField>
          <FormField label="New password" htmlFor="new_password" error={form.errors.new_password} hint="At least 8 characters. Avoid common passwords.">
            <PasswordInput {...form.bind("new_password")} autoComplete="new-password" required />
          </FormField>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={form.submitting}>
              {form.submitting && <Loader2Icon className="animate-spin" />} Update password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const { user, setUser } = useAuth()
  if (!user) return null

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account details and password." />
      <div className="grid max-w-3xl gap-6">
        <ProfileCard user={user} onSaved={setUser} />
        <PasswordCard />
      </div>
    </PageContainer>
  )
}
