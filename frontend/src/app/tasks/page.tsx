"use client"

import { TTaskPriority, TTaskSortBy, TTaskStatus } from "@/types/task"
import { LayoutGrid, Loader2 } from "lucide-react"
import { useState } from "react"
import { Toolbar } from "./_components/toolbar"
import { TaskBoard } from "./_components/task-board"
import { TASK_STATUS_LABEL, TASK_STATUSES } from "@/constants/task.constant"


export default function TaskPage() {

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<TTaskStatus | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<TTaskPriority | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<TTaskSortBy>("newest")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const mockCategories = [
        { id: "1", name: "Work", color: "blue" },
        { id: "2", name: "Personal", color: "green" },
    ]

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
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        priorityFilter={priorityFilter}
                        onPriorityFilterChange={setPriorityFilter}
                        categoryFilter={categoryFilter}
                        onCategoryFilterChange={setCategoryFilter}
                        categories={mockCategories}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onAddTask={() => setIsCreateDialogOpen(true)}
                    />
                </section>

                <TaskBoard statuses={TASK_STATUSES}>
                    {TASK_STATUSES.map((status) => (
                        <div
                            key={status}
                            className="flex min-h-[520px] min-w-0 flex-col rounded-2xl border border-muted bg-primary p-4 flex flex-col"                        >
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="truncate text-sm font-semibold text-foreground">
                                    {TASK_STATUS_LABEL[status]}
                                </h3>
                                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs text-muted-foreground">
                                    0
                                </span>
                            </div>

                            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-surface">
                                <p className="text-sm text-muted-foreground">No tasks yet</p>
                            </div>
                        </div>
                    ))}
                </TaskBoard>
            </div>


        </main>
    )
}