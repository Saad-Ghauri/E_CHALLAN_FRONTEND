"use client"

import * as React from "react"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"

/**
 * Create / edit / delete plumbing for a DRF resource.
 * `endpoint` looks like "/vehicles/"; `onDone` should refetch the list.
 */
export function useCrudDialog<T extends { id: number }>(endpoint: string, noun: string, onDone: () => void) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<T | null>(null)
  const [deleting, setDeleting] = React.useState<T | null>(null)

  const openCreate = () => {
    setEditing(null)
    setOpen(true)
  }
  const openEdit = (item: T) => {
    setEditing(item)
    setOpen(true)
  }

  const save = async (values: object) => {
    if (editing) await api.patch(`${endpoint}${editing.id}/`, values)
    else await api.post(endpoint, values)
    toast.success(editing ? `${noun} updated.` : `${noun} created.`)
    setOpen(false)
    onDone()
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await api.delete(`${endpoint}${deleting.id}/`)
      toast.success(`${noun} deleted.`)
      onDone()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : `Could not delete ${noun.toLowerCase()}.`)
      throw err
    }
  }

  return { open, setOpen, editing, openCreate, openEdit, save, deleting, setDeleting, confirmDelete }
}
