"use client"

import { Prisma } from "@prisma/client"
import moment from "moment"
import Link from "next/link"
import { likePost } from "../lib/actions"
import { useSession } from "next-auth/react"
import CommentForm from "./comment-form"

export default function PostCard({
  post,
}: {
  post: Prisma.PostGetPayload<{
    include: { user: { select: { profile: true } }; likes: true }
  }>
}) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const hasLiked = post.likes.find((like) => like.userId === userId)

  return (
    <article className="p-4 border-b border-gray-200 space-y-2">
      <header className="flex items-center justify-between">
        <p>
          <Link
            href={`/profile/${post.user.profile?.username}`}
            className="hover:underline"
          >
            <span className="font-bold">{post.user.profile?.name}</span>{" "}
            <span className="text-gray-600">{post.user.profile?.username}</span>
          </Link>
        </p>
        <time className="text-gray-600 text-sm">
          {moment(post.createdAt).format("LT")}
        </time>
      </header>
      <p>{post.content}</p>
      <footer>
        <div className="text-gray-600">
          {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
        </div>
        <button onClick={() => likePost(post.id)}>
          {!hasLiked ? "Like" : "Unlike"}
        </button>
      </footer>
      <section>
        <CommentForm />
      </section>
    </article>
  )
}
