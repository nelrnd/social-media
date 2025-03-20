import { NotificationType, Prisma } from "@prisma/client"

export default function Notification({
  notification,
}: {
  notification: Prisma.NotificationGetPayload<{
    include: { from: { select: { profile: true } } }
  }>
}) {
  return (
    <div className="p-6 border-b border-gray-200">
      <span className="font-bold hover:underline">
        {notification.from.profile?.name}
      </span>
      {getText(notification.type)}
    </div>
  )
}

function getText(notificationType: NotificationType) {
  switch (notificationType) {
    case "LIKE":
      return " liked your post"
    case "COMMENT":
      return " commented your post"
    case "FOLLOW":
      return " followed you"
    default:
      break
  }
}
