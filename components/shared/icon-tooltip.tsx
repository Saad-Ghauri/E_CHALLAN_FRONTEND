import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/** Names an icon-only control on hover and keyboard focus. */
export function IconTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
