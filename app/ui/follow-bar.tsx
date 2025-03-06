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
import Link from "next/link"

export default function FollowBar({
  profile,
}: {
  profile: Prisma.ProfileGetPayload<{
    include: { following: true; followers: true }
  }>
}) {
  return (
    <div className="flex items-center gap-8 text-gray-600">
      <FollowingDialog
        count={profile.following.length}
        profileId={profile.id}
        username={profile.username}
      />
      <FollowersDialog
        count={profile.followers.length}
        profileId={profile.id}
        username={profile.username}
      />
    </div>
  )
}

function FollowingDialog({
  count,
  profileId,
  username,
}: {
  count: number
  profileId: string
  username: string
}) {
  const [open, setOpen] = useState(false)
  const [followings, setFollowings] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  async function fetch() {
    setLoading(true)
    const followings = await fetchFollowings(profileId)
    setFollowings(followings.map((follow) => follow.following))
    setLoading(false)
  }

  useEffect(() => {
    if (open) {
      fetch()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:underline">
        <span className="text-black font-bold">{count}</span> following
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
          <DialogDescription className="sr-only">
            Followings of {username}
          </DialogDescription>
        </DialogHeader>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : followings.length ? (
            followings.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="text-center text-gray-600">No following for now</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FollowersDialog({
  count,
  profileId,
  username,
}: {
  count: number
  profileId: string
  username: string
}) {
  const [open, setOpen] = useState(false)
  const [followers, setFollowers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  async function fetch() {
    setLoading(true)
    const followers = await fetchFollowers(profileId)
    setFollowers(followers.map((follow) => follow.follower))
    setLoading(false)
  }

  useEffect(() => {
    if (open) {
      fetch()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:underline">
        <span className="text-black font-bold">{count}</span>{" "}
        {count === 1 ? "follower" : "followers"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
          <DialogDescription className="sr-only">
            Followers of {username}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : followers.length ? (
          followers.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <p className="text-center text-gray-600">No followers for now</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.username}`}
      className="block p-4 hover:bg-gray-50 hover:underline transition-colors"
    >
      <span className="font-bold">{profile.name}</span>{" "}
      <span className="text-gray-600">{profile.username}</span>
    </Link>
  )
}
