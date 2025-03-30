"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full p-3 pl-10 border rounded-sm bg-background border-border outline-2 placeholder:text-soft"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        spellCheck={false}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-6 h-[18px] w-[18px] -translate-y-1/2 text-soft peer-focus:text-foreground pointer-events-none" />
    </div>
  )
}
