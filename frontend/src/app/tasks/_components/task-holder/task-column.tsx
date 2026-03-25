"use client"

import { Button } from "@/components/ui/button"
import { STATUS_ICONS, STATUS_UI_CONFIG } from "@/constants/task"
import { cn } from "@/lib/utils"
import { TTaskCardData, TTaskCategory, TTaskStatus } from "@/types/task"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"

type TTaskColumnProps = {
  status: TTaskStatus
  title: string
  count?: number
  tasks?: TTaskCardData[]
  categories?: TTaskCategory[]
  onAddTask?: () => void
  onEditTask?: (task: TTaskCardData) => void
  onDeleteTask?: (taskId: string) => void
  onDuplicateTask?: (task: TTaskCardData) => void
}

export function TaskColumn({
  status,
  title,
  count = 0,
  tasks = [],
  categories = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: TTaskColumnProps) {
  const config = STATUS_UI_CONFIG[status]
  const StatusComponent = STATUS_ICONS[status]
  const hasTasks = tasks.length > 0

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
            <StatusComponent className="size-4" />
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
        {hasTasks ? (
          <div className="flex flex-1 flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDuplicate={onDuplicateTask}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-muted">
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