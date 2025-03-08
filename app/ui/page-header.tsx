"use client"

import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"

export default function PageHeader({
  title,
  allowBack,
}: {
  title: string
  allowBack?: boolean
}) {
  const router = useRouter()

  return (
    <header className="p-4 border-b border-gray-200 flex items-center gap-2">
      {allowBack && (
        <button
          onClick={() => router.back()}
          className="size-8 hover:bg-gray-100 transition-colors flex items-center justify-center rounded-full"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
      )}
      <div className="font-semibold text-xl">{title}</div>
    </header>
  )
}
