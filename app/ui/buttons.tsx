"use client"

import { useSession } from "next-auth/react"
import { likePost } from "../lib/actions"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline"
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"
import { Prisma } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import CommentForm from "./comment-form"

export function LikeButton({
  postId,
  likes,
}: {
  postId: string
  likes: Prisma.LikeGetPayload<{ select: { id: true; userId: true } }>[]
}) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const active = likes.find((like) => like.userId === userId)

  return (
    <button
      onClick={() => likePost(postId)}
      className="py-2 px-4 flex items-center gap-2 w-fit bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors relative z-10"
      aria-label={active ? "Unlike post" : "Like post"}
      title="Like"
    >
      {active ? (
        <HeartIconSolid className="size-4" />
      ) : (
        <HeartIconOutline className="size-4" />
      )}
      <p className="text-sm">{likes.length}</p>
    </button>
  )
}

export function CommentButton({
  postId,
  comments,
}: {
  postId: string
  comments: Prisma.CommentGetPayload<{ select: { id: true } }>[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="py-2 px-4 flex items-center gap-2 w-fit bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors relative z-10"
          aria-label="Comment post"
          title="Comment"
        >
          <ChatBubbleLeftIcon className="size-4" />
          <p className="text-sm">{comments.length}</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comment post</DialogTitle>
          <DialogDescription className="sr-only">
            Post a comment to post
          </DialogDescription>
        </DialogHeader>
        <CommentForm postId={postId} />
      </DialogContent>
    </Dialog>
  )
}
