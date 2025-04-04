import { cn } from "@/app/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-subtle", className)}
      {...props}
    />
  )
}

export { Skeleton }
