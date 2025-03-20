import { readAllNotifications } from "@/app/lib/actions"
import { fetchNotifications } from "@/app/lib/data"
import Notification from "@/app/ui/notification"
import PageHeader from "@/app/ui/page-header"

export default async function NotificationsPage() {
  const notifications = await fetchNotifications()

  readAllNotifications()

  return (
    <main>
      <PageHeader title="Notifications" />
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </main>
  )
}
