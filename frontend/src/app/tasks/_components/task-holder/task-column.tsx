"use client"

import { getTaskList } from "@/axios/task-api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SORT_MAP, STATUS_ICONS, STATUS_UI_CONFIG } from "@/constants/task"
import { cn } from "@/lib/utils"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { TTaskCategoryDto, TTaskItemDto, TTaskPriority, TTaskSortBy, TTaskStatus } from "../../_config/task.schema"
import { TaskCard } from "./task-card"

type TTaskColumnProps = {
  status: TTaskStatus
  title: string
  searchQuery: string
  priorityFilter: TTaskPriority | null
  categoryFilter: string | null
  sortBy: TTaskSortBy
  categories?: TTaskCategoryDto[]
  onAddTask?: () => void
  onEditTask?: (task: TTaskItemDto) => void
  onDeleteTask?: (taskId: string) => void
  onDuplicateTask?: (task: TTaskItemDto) => void
}

export function TaskColumn({
  status,
  title,
  searchQuery,
  priorityFilter,
  categoryFilter,
  sortBy,
  categories = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: TTaskColumnProps) {
  const config = STATUS_UI_CONFIG[status]
  const StatusComponent = STATUS_ICONS[status]

  const taskParams = useMemo(() => {
    return {
      limit: 5,
      search: searchQuery || undefined,
      status,
      priority: priorityFilter ?? undefined,
      categoryId: categoryFilter ?? undefined,
      sortBy: SORT_MAP[sortBy],
    }
  }, [searchQuery, status, priorityFilter, categoryFilter, sortBy])

  const {
    data: taskListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [
      "tasks",
      status,
      searchQuery,
      priorityFilter,
      categoryFilter,
      sortBy
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getTaskList({ ...taskParams, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const { page, totalPage } = lastPage
      if (page < totalPage)
        return page + 1
      return undefined
    }
  })

  const tasks = taskListData?.pages.flatMap(data => data.data) ?? []
  const hasTasks = tasks.length > 0

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        target.scrollHeight - target.scrollTop - target.clientHeight < 50
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

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
            {tasks.length}
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
          <ScrollArea onScrollCapture={handleScroll}>
            <div className="flex flex-1 flex-col gap-3 h-[500px]">
              {tasks?.map((task) => (
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
          </ScrollArea>

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