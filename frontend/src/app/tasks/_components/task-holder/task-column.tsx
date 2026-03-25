"use client"

import { Button } from "@/components/ui/button"
import { STATUS_ICONS, STATUS_UI_CONFIG } from "@/constants/task"
import { cn } from "@/lib/utils"
import { TTaskStatus } from "@/types/task"
import { Plus } from "lucide-react"

type TTaskColumnProps = {
  status: TTaskStatus
  title: string
  count?: number
  onAddTask?: () => void
  children: React.ReactNode
}

export function TaskColumn({
  status,
  title,
  count = 0,
  onAddTask,
  children,
}: TTaskColumnProps) {
  const config = STATUS_UI_CONFIG[status]

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
        <div className="flex flex-1 flex-col gap-3">{children}</div>
      </div>
    </div>
  )
}