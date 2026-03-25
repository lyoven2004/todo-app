"use client"

import { TASK_STATUS_OPTIONS } from "@/constants/task"
import { cn } from "@/lib/utils"
import { TTaskCardData, TTaskCategory, TTaskStatus } from "@/types/task"
import { TaskColumn } from "./task-column"

type TTaskBoardProps = {
  tasks: TTaskCardData[]
  categories: TTaskCategory[]
  onAddTask?: (status: TTaskStatus) => void
  onEditTask?: (task: TTaskCardData) => void
  onDeleteTask?: (taskId: string) => void
  onDuplicateTask?: (task: TTaskCardData) => void
}

export function TaskBoard({
  tasks,
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
          {TASK_STATUS_OPTIONS.map(({ value, label }) => {
            const tasksByStatus = tasks.filter(
              (task) => task.status === value
            )

            return (
              <TaskColumn
                key={value}
                status={value}
                title={label}
                count={tasksByStatus.length}
                tasks={tasksByStatus}
                categories={categories}
                onAddTask={
                  onAddTask && value === "NOT_STARTED"
                    ? () => onAddTask(value)
                    : undefined
                }
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onDuplicateTask={onDuplicateTask}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}