import { format, isValid, parseISO } from "date-fns"

export function formatDate(
    dateString?: string | null,
    formatStr = "MMM d"
) {
    if (!dateString) return null
    const date = parseISO(dateString)
    if (!isValid(date)) return null
    return format(date, formatStr)
}