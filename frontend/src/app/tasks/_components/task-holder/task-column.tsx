"use client"

import { Button } from "@/components/ui/button"
import { SORT_MAP, STATUS_ICONS, STATUS_UI_CONFIG } from "@/constants/task"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import { TTaskCategoryDto, TTaskItemDto, TTaskPriority, TTaskSortBy, TTaskStatus } from "../../_config/task.schema"
import { UIEventHandler, useMemo, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getTaskList } from "@/axios/task-api"
import { ScrollArea } from "@/components/ui/scroll-area"

type TTaskColumnProps = {
  status: TTaskStatus
  title: string
  count?: number
  categories?: TTaskCategoryDto[]
  onAddTask?: () => void
  onEditTask?: (task: TTaskItemDto) => void
  onDeleteTask?: (taskId: string) => void
  onDuplicateTask?: (task: TTaskItemDto) => void
}

export function TaskColumn({
  status,
  title,
  count = 0,
  categories = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: TTaskColumnProps) {
  const config = STATUS_UI_CONFIG[status]
  const StatusComponent = STATUS_ICONS[status]
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<TTaskPriority | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<TTaskSortBy>("newest")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [page, setPage] = useState(1)

  const taskParams = useMemo(() => {
    return {
      page,
      limit: 5,
      search: searchQuery || undefined,
      status,
      priority: priorityFilter ?? undefined,
      categoryId: categoryFilter ?? undefined,
      sortBy: SORT_MAP[sortBy],
    }
  }, [searchQuery, status, priorityFilter, categoryFilter, sortBy, page])
  const hasTasks = true
  const {
    data: taskListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
    // isLoading: isTaskLoading,
    // isError: isTaskError,
    // error: taskError,
  } = useInfiniteQuery({
    queryKey: ["tasks", taskParams],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getTaskList({ ...taskParams, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) => {
      const { page, totalPage } = lastPage
      console.log({page, totalPage})
      if (page < totalPage)
        return page + 1
      return undefined
    }

  })

  // const {
  //     data: categoryListData,
  //     isLoading: isCategoryLoading,
  // } = useQuery({
  //     queryKey: ["categories"],
  //     queryFn: getCategoryList,
  // })

  const tasks = taskListData?.pages.flatMap(data => data.data)

  const handleScroll = (event) => {
    // console.log(event)
    const target = event.target
    const {scrollHeight, scrollTop, clientHeight } = target

    if(hasNextPage && (scrollTop - scrollHeight - clientHeight < 50)){
      fetchNextPage()
    }
  }

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