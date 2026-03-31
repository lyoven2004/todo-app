import { TTaskPriority, TTaskStatus, TTaskSortBy } from "@/app/tasks/_config/task.schema";
import { CheckCircle2, Circle, Loader2, LucideIcon, XCircle } from "lucide-react";

export const TASK_STATUS_OPTIONS: Array<{ label: string; value: TTaskStatus }> = [
    { label: "Not Started", value: "NOT_STARTED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
    { label: "Failed", value: "FAILED" },
]

export const SORT_QUERY_MAP = {
  newest: {
    sortBy: "createdAt",
    order: "desc",
  },
  oldest: {
    sortBy: "createdAt",
    order: "asc",
  },
  dueDate: {
    sortBy: "expiredAt",
    order: "asc",
  },
} as const

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
]

export const STATUS_ICONS: Record<TTaskStatus, LucideIcon> = {
    NOT_STARTED: Circle,
    IN_PROGRESS: Loader2,
    DONE: CheckCircle2,
    FAILED: XCircle,
}

export const STATUS_UI_CONFIG: Record<
    TTaskStatus,
    {
        headerClassName: string
        iconClassName: string
        badgeClassName: string
        bodyClassName: string
        emptyClassName: string
    }
> = {
    NOT_STARTED: {
        headerClassName: "bg-muted/40",
        iconClassName: "text-muted-foreground",
        badgeClassName: "bg-muted text-muted-foreground",
        bodyClassName: "bg-page",
        emptyClassName: "border-muted",
    },
    IN_PROGRESS: {
        headerClassName: "bg-blue-50 dark:bg-blue-950/20",
        iconClassName: "text-blue-600 dark:text-blue-400",
        badgeClassName:
            "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
        bodyClassName: "bg-page",
        emptyClassName: "border-muted",
    },
    DONE: {
        headerClassName: "bg-green-50 dark:bg-green-950/20",
        iconClassName: "text-green-600 dark:text-green-400",
        badgeClassName:
            "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
        bodyClassName: "bg-page",
        emptyClassName: "border-muted",
    },
    FAILED: {
        headerClassName: "bg-red-50 dark:bg-red-950/20",
        iconClassName: "text-red-600 dark:text-red-400",
        badgeClassName:
            "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
        bodyClassName: "bg-page",
        emptyClassName: "border-muted",
    },
}

export const PRIORITY_CONFIG: Record<
    TTaskPriority,
    {
        label: string
        barClassName: string
        badgeClassName: string
    }
> = {
    HIGH: {
        label: "High",
        barClassName: "bg-destructive",
        badgeClassName:
            "border-destructive/20 bg-destructive/10 text-destructive",
    },
    MEDIUM: {
        label: "Medium",
        barClassName: "bg-yellow-500",
        badgeClassName:
            "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    },
    LOW: {
        label: "Low",
        barClassName: "bg-muted-foreground/40",
        badgeClassName:
            "border-border bg-muted text-muted-foreground",
    },
}

export const TASK_FORM_CONFIG = {
  create: {
    title: "Create Task",
    description: "Add a new task with all the important details.",
  },
  edit: {
    title: "Edit Task",
    description: "Update the details for this task.",
  },
} as const

