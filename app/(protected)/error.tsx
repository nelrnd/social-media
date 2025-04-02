"use client"

import { useEffect } from "react"
import { Button } from "../ui/buttons"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-dvh flex flex-col justify-center items-center gap-3">
      <h2 className="text-2xl">Something went wrong</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  )
}
