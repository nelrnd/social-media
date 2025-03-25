"use client"

import { usePathname, useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface HistoryContextType {
  history: string[]
  setHistory(data: string[]): void
  back(): void
}

const HistoryContext = createContext<HistoryContextType>(
  {} as HistoryContextType
)

export default function HistoryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [history, setHistory] = useState<string[]>([])

  function back() {
    const route = history.at(-2)
    router.push(route || "/")
    const newHistory = history.slice(0, -2)
    setHistory(newHistory)
  }

  useEffect(() => {
    setHistory((prevHistory) => [...prevHistory.slice(-20), pathname])
  }, [pathname])

  return (
    <HistoryContext.Provider value={{ back, history, setHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  return useContext(HistoryContext)
}
