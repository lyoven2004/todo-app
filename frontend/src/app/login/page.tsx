"use client";

import { LayoutGrid } from "lucide-react";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {

    return (
        <main className="min-h-screen bg-[#f8fafc] flex flex-col">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-50/40 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="flex flex-col items-center gap-2 mb-10">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-lg shadow-slate-900/20">
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                Welcome back
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Sign in to continue to your tasks
                            </p>
                        </div>

                        <LoginForm/>
                    </div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-8 max-w-sm">
                    By continuing, you agree to our{" "}
                    <a
                        href="/terms"
                        className="hover:text-foreground underline underline-offset-4"
                    >
                        Terms
                    </a>{" "}
                    and{" "}
                    <a
                        href="/privacy"
                        className="hover:text-foreground underline underline-offset-4"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>
        </main>
    );
}