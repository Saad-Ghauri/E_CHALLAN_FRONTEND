import { AuthGuard } from "@/components/auth-guard"
import { CitizenShell } from "@/components/citizen/citizen-shell"

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard area="citizen">
      <CitizenShell>{children}</CitizenShell>
    </AuthGuard>
  )
}
