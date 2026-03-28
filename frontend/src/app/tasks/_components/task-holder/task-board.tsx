"use client"

import { TASK_STATUS_OPTIONS } from "@/constants/task"
import { cn } from "@/lib/utils"
import { TaskColumn } from "./task-column"
import { TTaskItemDto, TTaskPriority, TTaskSortBy, TTaskStatus } from "../../_config/task.schema"
import { TCategoryDto } from "@/app/categories/_config/category.schema"

type TTaskBoardProps = {
  searchQuery: string

  statusFilter: TTaskStatus | null
  priorityFilter: TTaskPriority | null
  categoryFilter: string | null
  sortBy: TTaskSortBy

  categories?: TCategoryDto[]
  onAddTask?: (status: TTaskStatus) => void
  onEditTask?: (task: TTaskItemDto) => void
  onDeleteTask?: (taskId: string) => void
  onDuplicateTask?: (task: TTaskItemDto) => void
}

export function TaskBoard({
  searchQuery,
  statusFilter,
  priorityFilter,
  categoryFilter,
  sortBy,
  categories,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: TTaskBoardProps) {

  return (
    <section className={cn("w-full")}>
      <div className="rounded-2xl border border-muted bg-secondary p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-4">
          {TASK_STATUS_OPTIONS
            .map(({ value, label }) => (
              <TaskColumn
                key={value}
                status={value}
                title={label}
                categories={categories}
                searchQuery={searchQuery}
                priorityFilter={priorityFilter}
                categoryFilter={categoryFilter}
                sortBy={sortBy}
                onAddTask={() => onAddTask?.(value)}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onDuplicateTask={onDuplicateTask}                
              />
            )
            )}
        </div>
      </div>
    </section>
  )
}