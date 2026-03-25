"use client"

import { CalendarDays, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { PRIORITY_CONFIG } from "@/constants/task"
import { formatDate } from "@/lib/date"
import { TTaskCategoryDto, TTaskItemDto } from "../../_config/task.schema"

type TTaskCardProps = {
  task: TTaskItemDto
  categories?: TTaskCategoryDto[]
  onEdit?: (task: TTaskItemDto) => void
  onDelete?: (taskId: string) => void
  onDuplicate?: (task: TTaskItemDto) => void
}

function getCategoryBadgeClass(color?: string) {
  switch (color) {
    case "blue":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
    case "green":
      return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
    case "red":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    case "yellow":
      return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300"
    case "purple":
      return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

export function TaskCard({
  task,
  categories = [],
  onEdit,
  onDelete,
  onDuplicate,
}: TTaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority]
  const category = categories.find((item) => item.id === task.categoryId)
  const dueDate = formatDate(task.expiredAt)

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 -mr-1 -mt-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onDuplicate?.(task)}>
                <Copy className="mr-2 size-4" />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onDelete?.(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  "h-5 border px-2 py-0 text-[10px] font-medium",
                  getCategoryBadgeClass(category.color)
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