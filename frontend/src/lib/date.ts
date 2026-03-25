import { format, isValid, parseISO } from "date-fns"

export function formatDate(dateString?: string | null) {
  if (!dateString) return null

  const date = parseISO(dateString)

  if (!isValid(date)) return null

  return format(date, "MMM d")
}