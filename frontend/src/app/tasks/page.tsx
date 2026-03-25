import { LayoutGrid } from "lucide-react"


export default function TaskPage() {

    return (
        <main className="min-h-screen bg-page">
            <header className="sticky top-0 z-40 border-b border-surface bg-surface/80 backdrop-blur-xl">
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
                    <div className="rounded-2xl border border-surface bg-surface p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Toolbar area placeholder
                        </p>
                    </div>
                </section>

                <section>
                    <div className="min-h-[500px] rounded-2xl border border-surface bg-surface p-6 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Task board area placeholder
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}