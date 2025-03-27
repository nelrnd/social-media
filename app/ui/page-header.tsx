"use client"

import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import { Skeleton } from "./skeleton"
import { useHistory } from "../providers/history-provider"

export default function PageHeader({
  title,
  allowBack,
}: {
  title: string
  allowBack?: boolean
}) {
  const { back } = useHistory()

  return (
    <header className="h-[56px] sticky top-0 z-20 p-6 border-b border-border flex items-center gap-2 backdrop-blur-lg">
      {allowBack && (
        <button
          onClick={() => back()}
          className="size-8 bg-background hover:bg-subtle transition-colors flex items-center justify-center rounded-full"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
      )}
      <div className="font-semibold text-xl leading-none">{title}</div>
      <div className="bg-background opacity-90 absolute inset-0 -z-10"></div>
    </header>
  )
}

export function PageHeaderSkeleton() {
  return (
    <header className="h-[56px] p-6 border-b border-border flex items-center gap-2">
      <Skeleton className="h-5 w-[200px]" />
    </header>
  )
}
