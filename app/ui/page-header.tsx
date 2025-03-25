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
    <header className="h-[56px] p-6 border-b border-gray-200 flex items-center gap-2">
      {allowBack && (
        <button
          onClick={() => back()}
          className="size-8 hover:bg-gray-100 transition-colors flex items-center justify-center rounded-full"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
      )}
      <div className="font-semibold text-xl leading-none">{title}</div>
    </header>
  )
}

export function PageHeaderSkeleton() {
  return (
    <header className="h-[56px] p-6 border-b border-gray-200 flex items-center gap-2">
      <Skeleton className="h-5 w-[200px]" />
    </header>
  )
}
