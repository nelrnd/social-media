"use client"

import { Prisma } from "@prisma/client"
import Link from "next/link"
import Date from "./date"
import Avatar from "./avatar"
import { LikeCommentButton } from "./buttons"
import { useSession } from "next-auth/react"
import CommentMenu from "./comment-menu"
import { CommentWithRelations } from "../lib/definitions"
import ProfileHoverCard from "./profile-hover-card"

export default function Comment({
  comment,
}: {
  comment: CommentWithRelations
}) {
  const session = useSession()
  const userId = session.data?.user.id
  const fromMe = comment.userId === userId

  if (!comment.user.profile) return null

  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0 grid grid-cols-[auto_1fr] gap-4 relative">
      <ProfileHoverCard profile={comment.user.profile}>
        <Link
          href={`/profile/${comment.user.profile?.username}`}
          className="w-fit h-fit rounded-full hover:brightness-90 transition-all"
        >
          <Avatar src={comment.user.profile?.imageUrl} size="sm" />
        </Link>
      </ProfileHoverCard>

      <div>
        <header className="flex items-center gap-2">
          <ProfileHoverCard profile={comment.user.profile}>
            <Link
              href={`/profile/${comment.user.profile?.username}`}
              className="relative z-10 w-fit hover:underline"
            >
              <span className="font-bold">{comment.user.profile?.name}</span>{" "}
              <span className="text-gray-600">
                {comment.user.profile?.username}
              </span>
            </Link>
          </ProfileHoverCard>
          <Date date={comment.createdAt} />
        </header>

        <section className="mb-2">
          <p>{comment.content}</p>
        </section>

        <footer>
          <LikeCommentButton
            commentId={comment.id}
            userId={userId}
            initialLikes={comment.likes}
          />
        </footer>
      </div>

      {fromMe && <CommentMenu commentId={comment.id} />}
    </div>
  )
}
