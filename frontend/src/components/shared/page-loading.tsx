import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type PageLoadingProps = {
  message?: string
  fullScreen?: boolean
}

export function PageLoading({
  message = "Loading...",
  fullScreen = true,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[#f8fafc]",
        fullScreen ? "min-h-screen" : "min-h-[300px]"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}