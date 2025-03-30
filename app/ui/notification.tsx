import { NotificationType, Prisma } from "@prisma/client"
import Link from "next/link"
import Avatar from "./avatar"
import { PostMinimized } from "./post"
import { Skeleton } from "./skeleton"
import ProfileHoverCard from "./profile-hover-card"

export default function Notification({
  notification,
}: {
  notification: Prisma.NotificationGetPayload<{
    include: {
      from: {
        select: {
          profile: {
            include: {
              followers: {
                select: {
                  id: true
                }
              }
              following: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      }
      post: { include: { user: { select: { profile: true } } } }
      comment: { include: { user: { select: { profile: true } } } }
    }
  }>
}) {
  if (!notification.from.profile) {
    return null
  }

  let href
  if (notification.type === "FOLLOW") {
    href = "/profile/" + notification.from.profile.username
  } else {
    href = "/post/" + notification.postId
  }

  return (
    <div className="p-6 border-b border-border grid grid-cols-[auto_1fr] gap-4 relative hover:bg-subtle transition-colors">
      <ProfileHoverCard profile={notification.from.profile}>
        <Link
          href={`/profile/${notification.from.profile?.username}`}
          className="w-fit h-fit relative z-10"
        >
          <Avatar src={notification.from.profile?.imageUrl} size="sm" />
        </Link>
      </ProfileHoverCard>
      <div className="mt-2.5 space-y-2.5">
        <div>
          <ProfileHoverCard profile={notification.from.profile}>
            <Link
              href={`/profile/${notification.from.profile?.username}`}
              className="font-bold relative z-10 hover:underline"
            >
              {notification.from.profile?.name}
            </Link>
          </ProfileHoverCard>
          <span className="text-soft">{getText(notification.type)}</span>
        </div>

        {["LIKE", "COMMENT"].includes(notification.type) &&
          notification.post && <PostMinimized post={notification.post} />}

        {notification.type === "COMMENT" && notification.comment && (
          <p>{notification.comment.content}</p>
        )}
      </div>

      <Link href={href} className="absolute inset-0 z-0" />
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
