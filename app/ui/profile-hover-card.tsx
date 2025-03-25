import { Prisma } from "@prisma/client"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/ui/hover-card"
import Link from "next/link"
import Avatar from "./avatar"
import { spaceMono } from "../fonts"

export default function ProfileHoverCard({
  profile,
  children,
}: {
  profile: Prisma.ProfileGetPayload<{
    include: {
      followers: { select: { id: true } }
      following: { select: { id: true } }
    }
  }>
  children: React.ReactNode
}) {
  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="relative">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Avatar src={profile.imageUrl} size="md" />

            <div className="flex-1">
              <h1 className="font-bold leading-none">{profile?.name}</h1>
              <p className="text-gray-500">{profile?.username}</p>
            </div>
          </div>

          {profile.bio && <p>{profile.bio}</p>}

          <div className="text-gray-500 text-sm grid grid-cols-2 text-center gap-2 leading-none">
            <div>
              <span className={spaceMono.className}>
                {profile.following.length}
              </span>{" "}
              following
            </div>
            <div>
              <span className={spaceMono.className}>
                {profile.followers.length}
              </span>{" "}
              {profile.followers.length === 1 ? "follower" : "followers"}
            </div>
          </div>
        </div>

        <Link
          href={`/profile/${profile.username}`}
          className="absolute inset-0"
        ></Link>
      </HoverCardContent>
    </HoverCard>
  )
}
