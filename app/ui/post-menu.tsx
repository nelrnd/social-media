"use client"

import { HeartIcon } from "@heroicons/react/24/solid"
import { likePost } from "../lib/actions"
import { useSession } from "next-auth/react"

export default function PostMenu({ post }) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const hasLiked = post.likes.find((like) => like.userId === userId)

  return (
    <footer>
      <div className="text-gray-600">
        {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
      </div>
      <button onClick={() => likePost(post.id)}>
        {!hasLiked ? "Like" : "Unlike"}
      </button>
    </footer>
  )
}
