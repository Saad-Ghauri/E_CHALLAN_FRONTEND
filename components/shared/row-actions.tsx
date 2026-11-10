import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Edit / delete icon buttons for table rows. Omit a handler to hide its button. */
export function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      {onEdit && (
        <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
          <PencilIcon />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label="Delete">
          <Trash2Icon />
        </Button>
      )}
    </div>
  )
}
