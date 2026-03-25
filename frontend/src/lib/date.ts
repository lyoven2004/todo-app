export function formatDate(dateString?: string | null) {
  if (!dateString) return null

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}