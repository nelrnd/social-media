import { readAllNotifications } from "@/app/lib/actions"
import { fetchNotifications } from "@/app/lib/data"
import NotificationList from "@/app/ui/notification-list"
import PageHeader from "@/app/ui/page-header"

export default async function NotificationsPage() {
  const { notifications: initialNotifications, hasMore } =
    await fetchNotifications({})

  readAllNotifications()

  return (
    <main>
      <PageHeader title="Notifications" />
      <NotificationList
        initialNotifications={initialNotifications}
        initialHasMore={hasMore}
      />
    </main>
  )
}
