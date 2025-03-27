import { Profile } from "@prisma/client"
import Link from "next/link"
import Avatar from "./avatar"
import { Skeleton } from "./skeleton"

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.username}`}
      className="p-4 bg-background hover:bg-subtle grid grid-cols-[auto_1fr] items-center gap-4 hover:underline transition-colors"
    >
      <Avatar src={profile.imageUrl} size="sm" />
      <div className="flex flex-col gap-1 leading-none">
        <span className="font-bold">{profile.name}</span>{" "}
        <span className="text-soft">{profile.username}</span>
      </div>
    </Link>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="p-4 bg-background grid grid-cols-[auto_1fr] items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex flex-col gap-1 leading-none">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[75px]" />
      </div>
    </div>
  )
}
