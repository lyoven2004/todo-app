"use client"

import { TTaskPriority, TTaskSortBy, TTaskStatus } from "@/types/task"
import { LayoutGrid } from "lucide-react"
import { useState } from "react"
import { Toolbar } from "./_components/toolbar"
import { TaskBoard } from "./_components/task-holder/task-board"
import { TASK_STATUS_OPTIONS } from "@/constants/task"
import { TaskCard } from "./_components/task-holder/task-card"
import { TaskColumn } from "./_components/task-holder/task-column"


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
    const mockTasks = [
        {
            id: "1",
            title: "Prepare project brief",
            description: "Draft the task requirements for the team.",
            dueDate: "2026-03-30",
            priority: "HIGH" as const,
            categoryId: "1",
            status: "NOT_STARTED" as const,
        },
        {
            id: "2",
            title: "Review API schema",
            description: "Confirm response shape before integration.",
            dueDate: "2026-04-02",
            priority: "MEDIUM" as const,
            categoryId: "1",
            status: "IN_PROGRESS" as const,
        },
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

                <TaskBoard statuses={TASK_STATUS_OPTIONS.map(o => o.value)}>
                    {TASK_STATUS_OPTIONS.map(({ value, label }) => (
                        <TaskColumn
                            key={value}
                            status={value}
                            title={label}
                            count={0}
                            onAddTask={value === "NOT_STARTED" ? () => { } : undefined}
                        >
                            {mockTasks
                                .filter((task) => task.status === value)
                                .map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        categories={mockCategories}
                                        onEdit={(task) => console.log("edit", task)}
                                        onDelete={(id) => console.log("delete", id)}
                                        onDuplicate={(task) => console.log("duplicate", task)}
                                    />
                                ))}
                        </TaskColumn>
                    ))}
                </TaskBoard>
            </div>


        </main>
    )
}