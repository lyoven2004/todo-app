"use client"

import { LayoutGrid } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { TaskBoard } from "./_components/task-holder/task-board"
import { Toolbar } from "./_components/toolbar"
import { TTaskPriority, TTaskSortBy, TTaskStatus } from "./_config/task.schema"

export default function TaskPage() {

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<TTaskStatus | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<TTaskPriority | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<TTaskSortBy>("newest")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onAddTask={() => setIsCreateDialogOpen(true)}
                    />
                </section>

                <TaskBoard
                    onAddTask={(status) => {
                        toast.message(`Add task to ${status}`)
                    }}
                    onEditTask={(task) => console.log("edit", task)}
                    onDeleteTask={(id) => console.log("delete", id)}
                    onDuplicateTask={(task) => console.log("duplicate", task)}
                />
            </div>

        </main>
    )
}