"use client"

import * as React from "react"
import { toast } from "sonner"

import { ApiError } from "@/lib/api"

/**
 * Minimal form state: values, per-field server errors and a submit wrapper
 * that toasts failures and maps DRF field errors onto inputs.
 */
export function useForm<T extends Record<string, unknown>>(initial: T) {
  const [values, setValues] = React.useState<T>(initial)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)

  const set = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name as string]: "" }))
  }

  /** Props for a plain <Input> / <Textarea>. */
  const bind = (name: keyof T & string, format?: (value: string) => string) => ({
    id: name,
    value: (values[name] ?? "") as string,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(name, (format ? format(event.target.value) : event.target.value) as T[typeof name]),
    "aria-invalid": Boolean(errors[name]) || undefined,
  })

  const reset = (next: T = initial) => {
    setValues(next)
    setErrors({})
  }

  const submit = (action: (values: T) => Promise<unknown>) => async (event?: React.FormEvent) => {
    event?.preventDefault()
    setSubmitting(true)
    try {
      await action(values)
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors)
        toast.error(err.message)
      } else {
        toast.error("Unexpected error. Please try again.")
      }
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { values, errors, set, bind, reset, submit, submitting }
}
