"use client"

import { Circle, Loader2, CheckCircle2, XCircle, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TTaskStatus } from "@/types/task"

type TTaskColumnProps = {
  status: TTaskStatus
  title: string
  count?: number
  onAddTask?: () => void
  children?: React.ReactNode
}

const STATUS_ICONS: Record<TTaskStatus, React.ReactNode> = {
  NOT_STARTED: <Circle className="size-4" />,
  IN_PROGRESS: <Loader2 className="size-4" />,
  DONE: <CheckCircle2 className="size-4" />,
  FAILED: <XCircle className="size-4" />,
}

const STATUS_UI_CONFIG: Record<
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

export function TaskColumn({
  status,
  title,
  count = 0,
  onAddTask,
  children,
}: TTaskColumnProps) {
  const config = STATUS_UI_CONFIG[status]
  const hasContent = Boolean(children)

  return (
    <div className="flex min-h-[520px] min-w-0 flex-col rounded-2xl border border-muted bg-secondary">
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-t-2xl border-b border-muted px-4 py-3.5",
          config.headerClassName
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn("shrink-0", config.iconClassName)}>
            {STATUS_ICONS[status]}
          </span>

          <h3 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h3>

          <span
            className={cn(
              "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-medium tabular-nums",
              config.badgeClassName
            )}
          >
            {count}
          </span>
        </div>

        {onAddTask && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onAddTask}
          >
            <Plus className="size-4" />
          </Button>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-3", config.bodyClassName)}>
        {hasContent ? (
          <div className="flex flex-1 flex-col gap-3">{children}</div>
        ) : (
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed",
              config.emptyClassName
            )}
          >
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Tasks in this stage will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}