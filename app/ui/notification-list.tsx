"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import Notification, { NotificationSkeleton } from "./notification"
import { NotificationWithRelations } from "../lib/definitions"
import { fetchNotifications } from "../lib/data"

export default function NotificationList({
  initialNotifications,
  initialHasMore,
}: {
  initialNotifications: NotificationWithRelations[]
  initialHasMore: boolean
}) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const { ref, inView } = useInView()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    if (inView && hasMore) {
      async function loadMore() {
        const cursor = notifications.at(-1)?.id
        setIsLoading(true)
        const { notifications: newNotifications, hasMore } =
          await fetchNotifications({ cursor })
        if (!ignore) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...newNotifications,
          ])
          setHasMore(hasMore)
          setIsLoading(false)
        }
      }
      loadMore()
    }
    return () => {
      ignore = true
    }
  }, [inView, hasMore, notifications])

  return (
    <div>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      <div ref={ref} className="h-[1px]" />
      {isLoading &&
        [...Array(3).keys()].map((item) => <NotificationSkeleton key={item} />)}
      {!hasMore && (
        <div className="p-6 border-b border-border text-center text-soft">
          {notifications.length
            ? "No more notifications"
            : "No notifications for now"}
        </div>
      )}
    </div>
  )
}
