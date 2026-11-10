import { PencilIcon, Trash2Icon } from "lucide-react"

import { IconTooltip } from "@/components/shared/icon-tooltip"
import { Button } from "@/components/ui/button"

/** Edit / delete icon buttons for table rows. Omit a handler to hide its button. */
export function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      {onEdit && (
        <IconTooltip label="Edit">
          <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
            <PencilIcon />
          </Button>
        </IconTooltip>
      )}
      {onDelete && (
        <IconTooltip label="Delete">
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label="Delete">
            <Trash2Icon />
          </Button>
        </IconTooltip>
      )}
    </div>
  )
}
