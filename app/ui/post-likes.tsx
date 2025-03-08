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
import ProfileCard from "./profile-card"
import { Prisma, Profile } from "@prisma/client"

export default function PostLikes({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      async function fetch() {
        setLoading(true)
        const likes = await fetchLikes(postId)
        const profiles = likes.map((like) => like.user.profile) as Profile[]
        setProfiles(profiles)
        setLoading(false)
      }
      fetch()
    }
  }, [open, postId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-gray-600 hover:underline">
        See likes
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
          <DialogDescription className="sr-only">
            People who liked this post
          </DialogDescription>
        </DialogHeader>
        <div>
          {profiles.map((profile) => (
            <ProfileCard key={profile?.id} profile={profile} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
