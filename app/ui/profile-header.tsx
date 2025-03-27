"use client"

import Link from "next/link"
import Avatar from "./avatar"
import FollowBar from "./follow-bar"
import { Prisma } from "@prisma/client"
import { Skeleton } from "./skeleton"
import { FollowButton } from "./buttons"
import { useImageGallery } from "../providers/image-gallery-provider"

export default function ProfileHeader({
  profile,
  authUserId,
  isFollowing,
}: {
  profile: Prisma.ProfileGetPayload<{
    include: { following: true; followers: true }
  }>
  authUserId: string
  isFollowing: boolean
}) {
  const sameUser = authUserId === profile.userId
  const { openGallery } = useImageGallery()

  return (
    <header className="p-6 space-y-4 border-b border-border">
      <div className="flex items-center gap-6">
        {profile.imageUrl ? (
          <button
            className="rounded-full"
            onClick={() =>
              openGallery({
                images: [profile.imageUrl as string],
                isAvatar: true,
              })
            }
          >
            <Avatar src={profile.imageUrl} size="xl" />
          </button>
        ) : (
          <Avatar src={profile.imageUrl} size="xl" />
        )}

        <div className="flex-1">
          <h1 className="text-4xl font-bold">{profile?.name}</h1>
          <p className="text-soft">{profile?.username}</p>
        </div>

        <div className="w-fit">
          {sameUser ? (
            <Link
              href="/settings/profile"
              className="w-fit h-[3.125rem] py-3 px-6 flex items-center gap-4 justify-center  disabled:opacity-50 transition-all rounded-sm relative bg-background border border-border hover:bg-subtle"
            >
              Edit
            </Link>
          ) : (
            <FollowButton profileId={profile.id} isFollowing={isFollowing} />
          )}
        </div>
      </div>
      <p>{profile?.bio}</p>
      <FollowBar profile={profile} isFollowing={isFollowing} />
    </header>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <header className="p-6 space-y-4 border-b border-border">
      <div className="flex items-center gap-6">
        <Skeleton className="size-32 min-w-32 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-9 w-[200px] max-w-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Skeleton className="h-10 w-24 ml-auto" />
      </div>
      <Skeleton className="h-6 w-[150px]" />
      <div className="flex items-center gap-8">
        <Skeleton className="h-6 w-[84px]" />
        <Skeleton className="h-6 w-[84px]" />
      </div>
    </header>
  )
}
