"use client"

import { LayoutGrid } from "lucide-react"
import { RegisterForm } from "./_components/register-form"

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8fafc]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 shadow-lg shadow-slate-900/20">
            <LayoutGrid className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Kanban
            </h1>
            <p className="text-sm text-muted-foreground">Task Management</p>
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Create an account
              </h2>
              <p className="mt-2 text-muted-foreground">
                Sign up to start managing your tasks
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>

      </div>
    </main>
  )
}