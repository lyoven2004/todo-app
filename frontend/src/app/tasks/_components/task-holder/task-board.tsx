"use client"

import { cn } from "@/lib/utils"
import { TTaskStatus } from "@/types/task"

type TTaskBoardProps = {
  statuses: TTaskStatus[]
  children: React.ReactNode
  className?: string
}

export function TaskBoard({
  statuses,
  children,
  className,
}: TTaskBoardProps) {
  const hasColumns = statuses.length > 0

  return (
    <section className={cn("w-full", className)}>
      <div className="rounded-2xl border border-muted bg-secondary p-4 shadow-sm">
        {hasColumns ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-4">
            {children}
          </div>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-muted">
            <p className="text-sm text-muted-foreground">
              No board columns available.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}