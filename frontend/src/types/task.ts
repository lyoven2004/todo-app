export type TTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "FAILED"
export type TTaskPriority = "HIGH" | "MEDIUM" | "LOW"
export type TTaskSortBy = "newest" | "oldest" | "dueDate" | "priority"

export type TTaskCardCategory = {
  id: string
  name: string
  color?: string
}

export type TTaskCardData = {
  id: string
  title: string
  description?: string | null
  dueDate?: string | null
  priority: TTaskPriority
  categoryId?: string | null
}