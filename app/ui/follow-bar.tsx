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
import ProfileCard, { ProfileCardSkeleton } from "./profile-card"
import { spaceMono } from "../fonts"

export default function FollowBar({
  profile,
}: {
  profile: Prisma.ProfileGetPayload<{
    include: { following: true; followers: true }
  }>
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
  const [profiles, setProfiles] = useState<Profile[]>([])
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
        <span className={`text-black font-bold ${spaceMono.className}`}>
          {count}
        </span>{" "}
        <span className="text-gray-600">following</span>
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
            [...Array(count || 3).keys()].map((item) => (
              <ProfileCardSkeleton key={item} />
            ))
          ) : profiles.length ? (
            profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="py-4 text-gray-600 text-center">
              No following for now
            </p>
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
}: {
  profileId: string
  count?: number
  username: string
}) {
  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

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
      <DialogTrigger className="hover:underline">
        <span className={`text-black font-bold ${spaceMono.className}`}>
          {count}
        </span>{" "}
        <span className="text-gray-600">
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

        <div>
          {loading ? (
            [...Array(count || 3).keys()].map((item) => (
              <ProfileCardSkeleton key={item} />
            ))
          ) : profiles.length ? (
            profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="py-4 text-gray-600 text-center">
              No followers for now
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
