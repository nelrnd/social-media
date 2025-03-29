"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { Prisma, Profile } from "@prisma/client"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { fetchFollowers, fetchFollowings } from "../lib/data"
import ProfileCard, { ProfileCardSkeleton } from "./profile-card"
import { spaceMono } from "../fonts"
import clsx from "clsx"
import { ProfileWithRelations } from "../lib/definitions"

export default function FollowBar({
  profile,
  isFollowing,
}: {
  profile: Prisma.ProfileGetPayload<{
    include: { following: true; followers: true }
  }>
  isFollowing?: boolean
}) {
  return (
    <div className="flex items-center gap-8">
      <FollowingDialog
        count={profile.following.length}
        profileId={profile.id}
        username={profile.username}
      />
      <FollowersDialog
        count={profile.followers.length}
        profileId={profile.id}
        username={profile.username}
        isFollowing={isFollowing}
      />
    </div>
  )
}

function FollowingDialog({
  profileId,
  count,
  username,
}: {
  profileId: string
  count?: number
  username: string
}) {
  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState<ProfileWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      async function fetch() {
        setLoading(true)
        const followings = await fetchFollowings(profileId)
        setProfiles(followings.map((follow) => follow.following))
        setLoading(false)
      }
      fetch()
    }
  }, [open, profileId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:underline">
        <span className={`text-foreground font-bold ${spaceMono.className}`}>
          {count}
        </span>{" "}
        <span className="text-soft">following</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
          <DialogDescription className="sr-only">
            Followings of {username}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto">
          {loading ? (
            [...Array(count || 1).keys()].map((item) => (
              <ProfileCardSkeleton key={item} />
            ))
          ) : profiles.length ? (
            profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="py-4 text-soft text-center">No following for now</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FollowersDialog({
  profileId,
  count,
  username,
  isFollowing,
}: {
  profileId: string
  count: number
  username: string
  isFollowing?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState<ProfileWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  const prevCount = isFollowing ? count - 1 : count + 1

  useEffect(() => {
    if (open) {
      async function fetch() {
        setLoading(true)
        const followers = await fetchFollowers(profileId)
        setProfiles(followers.map((follow) => follow.follower))
        setLoading(false)
      }
      fetch()
    }
  }, [open, profileId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:underline group h-[25px]">
        <div
          className={`inline-block text-foreground font-bold ${spaceMono.className} h-[25px] overflow-hidden`}
        >
          <div
            className={clsx("inline-flex flex-col transition-transform", {
              "-translate-y-1/2": count > prevCount,
              "translate-y-0": count <= prevCount,
            })}
          >
            {count > prevCount ? (
              <>
                <span aria-hidden={true}>{prevCount} </span>
                <span className="group-hover:underline">{count} </span>
              </>
            ) : (
              <>
                <span className="group-hover:underline">{count} </span>
                <span aria-hidden={true}>{prevCount} </span>
              </>
            )}
          </div>
        </div>
        <span className="inline-block text-soft relative bottom-[7px] group-hover:underline">
          &nbsp;
          {count === 1 ? "follower" : "followers"}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
          <DialogDescription className="sr-only">
            Followers of {username}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto">
          {loading ? (
            [...Array(count || 1).keys()].map((item) => (
              <ProfileCardSkeleton key={item} />
            ))
          ) : profiles.length ? (
            profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="py-4 text-soft text-center">No followers for now</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
