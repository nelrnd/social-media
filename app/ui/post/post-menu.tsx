"use client"

import { likePost } from "@/app/lib/actions"
import { useSession } from "next-auth/react"
import { Comment, Like } from "@prisma/client"
import {
  ChatBubbleLeftIcon,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"

export default function PostMenu({
  postId,
  likes,
  comments,
}: {
  postId: string
  likes: Like[]
  comments: Comment[]
}) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const hasLiked = likes.find((like) => like.userId === userId)

  return (
    <div className="p-4 pt-0 space-y-2">
      <div className="text-gray-600 text-sm flex items-center gap-4">
        <div>
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </div>
        <div>
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => likePost(postId)}
          className="flex items-center gap-2 w-fit py-2 px-4 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          {!hasLiked ? (
            <HeartIconOutline className="size-4" />
          ) : (
            <HeartIconSolid className="size-4" />
          )}
          {!hasLiked ? "Like" : "Unlike"}
        </button>
        <button
          onClick={() => likePost("to be modified")}
          className="flex items-center gap-2 w-fit py-2 px-4 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          <ChatBubbleLeftIcon className="size-4" />
          Comment
        </button>
      </div>
    </div>
  )
}
