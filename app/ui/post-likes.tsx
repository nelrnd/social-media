"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { fetchLikes } from "../lib/data"
import ProfileCard, { ProfileCardSkeleton } from "./profile-card"
import { Profile } from "@prisma/client"
import clsx from "clsx"
import { ProfileWithRelations } from "../lib/definitions"

export default function PostLikes({
  postId,
  count,
  className,
}: {
  postId: string
  count?: number
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState<ProfileWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      async function fetch() {
        setLoading(true)
        const likes = await fetchLikes(postId)
        const profiles = likes.map(
          (like) => like.user.profile
        ) as ProfileWithRelations[]
        setProfiles(profiles)
        setLoading(false)
      }
      fetch()
    }
  }, [open, postId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={clsx("text-soft hover:underline", className)}>
        See likes
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
          <DialogDescription className="sr-only">
            People who liked this post
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto">
          {loading ? (
            [...Array(count || 3).keys()].map((item) => (
              <ProfileCardSkeleton key={item} />
            ))
          ) : profiles.length ? (
            profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="py-4 text-soft text-center">No likes for now</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
