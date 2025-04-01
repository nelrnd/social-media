"use client"

import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchUnreadNotificationCount } from "../lib/data"
import { readAllNotifications } from "../lib/actions"

type NotificationContextType = {
  count: number | null
}

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType
)

export default function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    ;(async () => {
      if (pathname === "/notifications") {
        setCount(0)
        await readAllNotifications()
      } else {
        const count = await fetchUnreadNotificationCount()
        setCount(count)
      }
    })()
  }, [pathname])

  return (
    <NotificationContext.Provider value={{ count }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
