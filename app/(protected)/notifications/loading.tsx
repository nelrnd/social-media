import { NotificationSkeleton } from "@/app/ui/notification"
import PageHeader from "@/app/ui/page-header"

export default function Loading() {
  return (
    <main className="h-dvh overflow-hidden">
      <PageHeader title="Notifications" />
      {[...Array(8).keys()].map((item) => (
        <NotificationSkeleton key={item} />
      ))}
    </main>
  )
}
