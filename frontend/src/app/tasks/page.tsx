"use client"

import { LayoutGrid } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useDebounce } from "../hooks/use-debounce"
import { TaskBoard } from "./_components/task-holder/task-board"
import { Toolbar } from "./_components/toolbar"
import { TTaskFormMode, TTaskFormValues, TTaskItemDto, TTaskPriority, TTaskSortBy, TTaskStatus } from "./_config/task.schema"
import { TaskFormModal } from "./_components/task-form/task-form-modal"

export default function TaskPage() {

    const [searchInput, setSearchInput] = useState("")
    const searchQuery = useDebounce(searchInput.trim(), 400)
    const [statusFilter, setStatusFilter] = useState<TTaskStatus | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<TTaskPriority | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<TTaskSortBy>("newest")
    const [isOpen, setIsOpen] = useState(false)
    const [taskData, setTaskData] = useState<TTaskItemDto>({} as TTaskItemDto)
    const [mode, setMode] = useState<TTaskFormMode>('create')

    const handleOpenCreateTask = (status?: TTaskStatus) => {
        setTaskData({
            id: "",
            title: "",
            description: "",
            status: status || 'NOT_STARTED',
            priority: "LOW",
            expiredAt: "",
            categoryId: "",
        })
        setIsOpen(true)
        setMode('create')
    }

    const handleOpenEditTask = (task: TTaskItemDto) => {
        setIsOpen(true)
        setTaskData(task)
        setMode('edit')
    }

    const handleCloseTaskModal = () => {
        setIsOpen(false)
        setTaskData({} as TTaskItemDto)
    }

    return (
        <main className="min-h-screen bg-primary">
            <header className="sticky top-0 z-40 border-b border-muted bg-secondary/80 backdrop-blur-xl">
                <div className="app-container">
                    <div className="flex h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-brand-panel shadow-brand">
                                <LayoutGrid className="size-4.5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-base font-semibold tracking-tight text-foreground">
                                    Kanban
                                </h1>
                                <p className="-mt-0.5 text-xs text-muted-foreground">
                                    Task Management
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="app-container py-10">
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                        Tasks
                    </h2>
                    <p className="mt-2 max-w-lg text-base text-muted-foreground">
                        Manage and organize your tasks across different stages.
                    </p>
                </section>

                <section className="mb-6">
                    <Toolbar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        priorityFilter={priorityFilter}
                        onPriorityFilterChange={setPriorityFilter}
                        categoryFilter={categoryFilter}
                        onCategoryFilterChange={setCategoryFilter}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onAddTask={handleOpenCreateTask}
                    />
                </section>

                <TaskBoard
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    categoryFilter={categoryFilter}
                    sortBy={sortBy}
                    onAddTask={(status) => {
                        handleOpenCreateTask(status)
                    }}
                    onEditTask={handleOpenEditTask}
                    onDeleteTask={(id) => console.log("delete", id)}
                    onDuplicateTask={(task) => console.log("duplicate", task)}
                />

                <TaskFormModal
                    mode={mode}
                    open={isOpen}
                    onOpenChange={(open) => {
                        if (!open) handleCloseTaskModal()
                    }}
                    task={taskData}
                    categories={[]}
                />

            </div>

        </main>
    )
}

