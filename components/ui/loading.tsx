import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
}

export function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-[#10b981]",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-gray-400">{text}</p>
      )}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Loading size="lg" text="Loading VenueSync..." />
    </div>
  )
}
