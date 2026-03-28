"use client"

import { CalendarDays } from "lucide-react"

import { TCategoryDto } from "@/app/categories/_config/category.schema"
import { useCategories } from "@/app/categories/_hooks/category.hook"
import { Badge } from "@/components/ui/badge"
import { PRIORITY_CONFIG } from "@/constants/task"
import { formatDate } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { TTaskItemDto } from "../../_config/task.schema"

type TTaskCardProps = {
  task: TTaskItemDto
  categories?: TCategoryDto[]
  onEdit?: (task: TTaskItemDto) => void
  onDelete?: (taskId: string) => void
  onDuplicate?: (task: TTaskItemDto) => void
}

export function TaskCard({
  task,
  onEdit,
}: TTaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority]
  const { categories } = useCategories()
  const dueDate = formatDate(task.expiredAt)

  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map(c => [c.id, c]))
  }, [categories])

  const category = categoryMap[task.categoryId || ""]

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border/70 bg-background",
        "shadow-sm transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "absolute bottom-3 left-0 top-3 w-1 rounded-full",
          priorityConfig.barClassName
        )}
      />

      <div className="p-4 pl-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {task.title}
          </h3>
        </div>

        <div
          className="cursor-pointer"
          onClick={() => onEdit?.(task)}
        >
          {task.description && (
            <p className="mb-3 line-clamp-2 pl-0 text-sm leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-2">
            {category && (
              <Badge
                variant="outline"
                className={cn(
                  "h-5 border px-2 py-0 text-[10px] font-medium border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300",
                )}
              >
                {category.name}
              </Badge>
            )}

            {dueDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                <span>{dueDate}</span>
              </div>
            )}

            <Badge
              variant="outline"
              className={cn(
                "h-5 px-2 py-0 text-[10px] font-medium",
                priorityConfig.badgeClassName
              )}
            >
              {priorityConfig.label}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}