import { TTaskPriority, TTaskSortBy, TTaskStatus } from "@/types/task.type";

export const STATUS_OPTIONS: Array<{ label: string; value: TTaskStatus }> = [
    { label: "Not Started", value: "NOT_STARTED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
    { label: "Failed", value: "FAILED" },
]

export const PRIORITY_OPTIONS: Array<{
    label: string
    value: TTaskPriority
    dotClassName: string
}> = [
        { label: "High", value: "HIGH", dotClassName: "bg-destructive" },
        { label: "Medium", value: "MEDIUM", dotClassName: "bg-priority-medium" },
        { label: "Low", value: "LOW", dotClassName: "bg-muted-foreground/40" },
    ]

export const SORT_OPTIONS: Array<{ label: string; value: TTaskSortBy }> = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Due Date", value: "dueDate" },
    { label: "Priority", value: "priority" },
]