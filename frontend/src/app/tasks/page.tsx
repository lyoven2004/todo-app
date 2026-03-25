import { LayoutGrid, Loader2 } from "lucide-react"

type TaskPageProps = {
  isLoading?: boolean
}

export default function TaskPage({ isLoading = false }: TaskPageProps) {
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="mx-auto max-w-[1800px] px-8 lg:px-12">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 shadow-lg shadow-slate-900/20">
                <LayoutGrid className="size-4.5 text-white" />
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

      <div className="mx-auto max-w-[1800px] px-8 py-10 lg:px-12">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Tasks
          </h2>
          <p className="mt-2 max-w-lg text-base text-muted-foreground">
            Manage and organize your tasks across different stages.
          </p>
        </section>

        <section className="mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Toolbar area placeholder
            </p>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px]">
            <p className="text-sm text-muted-foreground">
              Task board area placeholder
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}