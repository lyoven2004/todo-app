"use client"

import { Search, SlidersHorizontal, ArrowUpDown, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TTaskPriority, TTaskSortBy, TTaskStatus } from "@/types/task"
import { PRIORITY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "@/constants/task.constant"

export type TToolbarCategory = {
    id: string
    name: string
    color?: string
}

type TToolbarProps = {
    searchQuery: string
    onSearchChange: (value: string) => void

    statusFilter: TTaskStatus | null
    onStatusFilterChange: (value: TTaskStatus | null) => void

    priorityFilter: TTaskPriority | null
    onPriorityFilterChange: (value: TTaskPriority | null) => void

    categoryFilter: string | null
    onCategoryFilterChange: (value: string | null) => void
    categories?: TToolbarCategory[]

    sortBy: TTaskSortBy
    onSortChange: (value: TTaskSortBy) => void

    onAddTask: () => void
}

function getCategoryDotClass(color?: string) {
    switch (color) {
        case "blue":
            return "bg-category-blue"
        case "green":
            return "bg-category-green"
    }
}

export function Toolbar({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    priorityFilter,
    onPriorityFilterChange,
    categoryFilter,
    onCategoryFilterChange,
    categories = [],
    sortBy,
    onSortChange,
    onAddTask,
}: TToolbarProps) {
    const hasActiveFilters =
        statusFilter !== null ||
        priorityFilter !== null ||
        categoryFilter !== null

    return (
        <section
            className={cn(
                "mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm",
                "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            )}
        >
            <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tasks..."
                    className="h-10 rounded-xl pl-9"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "h-10 rounded-xl px-4",
                                hasActiveFilters &&
                                "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                            )}
                        >
                            <SlidersHorizontal className="size-4" />
                            <span className="ml-2 hidden sm:inline">Filter</span>
                            {hasActiveFilters && (
                                <span className="ml-2 size-2 rounded-full bg-primary" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="max-h-[420px] w-56 overflow-auto rounded-xl"
                    >
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                            checked={statusFilter === null}
                            onCheckedChange={() => onStatusFilterChange(null)}
                        >
                            All Statuses
                        </DropdownMenuCheckboxItem>

                        {STATUS_OPTIONS.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option.value}
                                checked={statusFilter === option.value}
                                onCheckedChange={() =>
                                    onStatusFilterChange(
                                        statusFilter === option.value ? null : option.value
                                    )
                                }
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Priority</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                            checked={priorityFilter === null}
                            onCheckedChange={() => onPriorityFilterChange(null)}
                        >
                            All Priorities
                        </DropdownMenuCheckboxItem>

                        {PRIORITY_OPTIONS.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option.value}
                                checked={priorityFilter === option.value}
                                onCheckedChange={() =>
                                    onPriorityFilterChange(
                                        priorityFilter === option.value ? null : option.value
                                    )
                                }
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className={cn("size-2 rounded-full", option.dotClassName)}
                                    />
                                    {option.label}
                                </span>
                            </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Category</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                            checked={categoryFilter === null}
                            onCheckedChange={() => onCategoryFilterChange(null)}
                        >
                            All Categories
                        </DropdownMenuCheckboxItem>

                        {categories.map((category) => (
                            <DropdownMenuCheckboxItem
                                key={category.id}
                                checked={categoryFilter === category.id}
                                onCheckedChange={() =>
                                    onCategoryFilterChange(
                                        categoryFilter === category.id ? null : category.id
                                    )
                                }
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "size-2 rounded-full",
                                            getCategoryDotClass(category.color)
                                        )}
                                    />
                                    {category.name}
                                </span>
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 rounded-xl px-4">
                            <ArrowUpDown className="size-4" />
                            <span className="ml-2 hidden sm:inline">Sort</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44 rounded-xl">
                        <DropdownMenuRadioGroup
                            value={sortBy}
                            onValueChange={(value) => onSortChange(value as TTaskSortBy)}
                        >
                            {SORT_OPTIONS.map((option) => (
                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                    {option.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden h-6 w-px bg-border md:block" />

                <Button
                    size="sm"
                    onClick={onAddTask}
                    className="h-10 rounded-xl px-4"
                >
                    <Plus className="size-4" />
                    <span className="ml-2 hidden sm:inline">Add Task</span>
                </Button>
            </div>
        </section>
    )
}