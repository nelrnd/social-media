import { NotificationType, Prisma } from "@prisma/client"
import Link from "next/link"
import Avatar from "./avatar"
import { PostMinimized } from "./post"
import { Skeleton } from "./skeleton"

export default function Notification({
  notification,
}: {
  notification: Prisma.NotificationGetPayload<{
    include: {
      from: { select: { profile: true } }
      post: { include: { user: { select: { profile: true } } } }
      comment: { include: { user: { select: { profile: true } } } }
    }
  }>
}) {
  return (
    <div className="p-6 border-b border-border grid grid-cols-[auto_1fr] gap-4">
      <Avatar src={notification.from.profile?.imageUrl} size="sm" />
      <div className="mt-2.5 space-y-2.5">
        <div>
          <Link
            href={`/profile/${notification.from.profile?.username}`}
            className="font-bold hover:underline"
          >
            {notification.from.profile?.name}
          </Link>
          {getText(notification.type)}
        </div>

        {["LIKE", "COMMENT"].includes(notification.type) &&
          notification.post && <PostMinimized post={notification.post} />}

        {notification.type === "COMMENT" && notification.comment && (
          <p>{notification.comment.content}</p>
        )}
      </div>
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

export function NotificationSkeleton() {
  return (
    <div className="p-6 border-b border-border grid grid-cols-[auto_1fr] gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="mt-2.5 space-y-2.5">
        <div>
          <Skeleton className="h-4 my-1 w-[6rem]" />
        </div>

        {!!Math.round(Math.random()) && (
          <Skeleton className="h-[5.125rem] w-full rounded-md" />
        )}
      </div>
    </div>
  )
}
