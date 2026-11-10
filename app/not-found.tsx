import Link from "next/link"
import { CompassIcon } from "lucide-react"

import { Brand } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <Brand />
      <div className="glass flex max-w-md flex-col items-center gap-3 rounded-3xl p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CompassIcon className="size-6" />
        </span>
        <h1 className="font-heading text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-muted-foreground">The page you are looking for does not exist or has moved.</p>
        <Button asChild className="mt-2">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
