"use client"

import * as React from "react"
import { FileVideoIcon, ImageIcon, UploadCloudIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ACCEPT = "image/jpeg,image/png,image/bmp,image/webp,video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm"

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`

export const VIDEO_ACCEPT = "video/mp4,video/x-msvideo,video/quicktime,video/x-matroska,video/webm"

export function UploadZone({
  file,
  onFile,
  disabled,
  accept = ACCEPT,
  title = "Drop a traffic image or video here, or click to browse",
  hint = "JPG, PNG, WEBP · MP4, AVI, MOV, MKV · up to 100 MB",
}: {
  file: File | null
  onFile: (file: File | null) => void
  disabled?: boolean
  accept?: string
  title?: string
  hint?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const pick = (files: FileList | null) => files?.[0] && onFile(files[0])

  if (file) {
    const isVideo = file.type.startsWith("video/")
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Selected upload preview" className="size-full object-cover" />
          ) : isVideo ? (
            <FileVideoIcon className="size-6" />
          ) : (
            <ImageIcon className="size-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {isVideo ? "Video" : "Image"} · {formatSize(file.size)}
          </p>
        </div>
        <Button variant="ghost" size="icon" disabled={disabled} onClick={() => onFile(null)} aria-label="Remove file">
          <XIcon />
        </Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        pick(event.dataTransfer.files)
      }}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:border-primary/60 hover:bg-primary/5",
        dragging && "border-primary bg-primary/5"
      )}
    >
      <div className="rounded-full bg-primary/10 p-3 text-primary">
        <UploadCloudIcon className="size-6" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          pick(event.target.files)
          event.target.value = ""
        }}
      />
    </button>
  )
}
