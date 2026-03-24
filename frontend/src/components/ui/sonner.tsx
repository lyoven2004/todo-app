"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group rounded-xl border shadow-lg px-4 py-3 gap-3 items-start",
          title: "text-sm font-semibold leading-5",
          description: "mt-1 text-sm leading-5",
          icon: "mt-0.5 shrink-0",
          closeButton:
            "bg-transparent border-0 text-current opacity-70 hover:opacity-100",
          success:
            "!bg-emerald-50 !border-emerald-200 !text-emerald-950 dark:!bg-emerald-950 dark:!border-emerald-800 dark:!text-emerald-50",
          error:
            "!bg-rose-50 !border-rose-200 !text-rose-950 dark:!bg-rose-950 dark:!border-rose-800 dark:!text-rose-50",
          warning:
            "!bg-amber-50 !border-amber-200 !text-amber-950 dark:!bg-amber-950 dark:!border-amber-800 dark:!text-amber-50",
          info:
            "!bg-sky-50 !border-sky-200 !text-sky-950 dark:!bg-sky-950 dark:!border-sky-800 dark:!text-sky-50",
          loading:
            "!bg-slate-50 !border-slate-200 !text-slate-950 dark:!bg-slate-950 dark:!border-slate-800 dark:!text-slate-50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
