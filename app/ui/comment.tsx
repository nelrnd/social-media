"use client"

import Link from "next/link"
import Date from "./date"
import Avatar from "./avatar"
import { LikeCommentButton } from "./buttons"
import { useSession } from "next-auth/react"
import CommentMenu from "./comment-menu"
import { CommentWithRelations } from "../lib/definitions"
import ProfileHoverCard from "./profile-hover-card"
import { Skeleton } from "./skeleton"

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
    <div className="py-6 border-b border-subtle last:border-b-0 grid grid-cols-[auto_1fr] gap-4 relative">
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
              <span className="text-soft">
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

      <CommentMenu commentId={comment.id} asAuthor={fromMe} />
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div className="py-6 border-b border-subtle last:border-b-0 grid grid-cols-[auto_1fr] gap-4 relative">
      <Skeleton className="size-12 rounded-full" />

      <div>
        <header className="flex items-center gap-2">
          <Skeleton className="h-4 my-1 w-[3rem]" />
          <Skeleton className="h-4 my-1 w-[3rem]" />
          <Skeleton className="h-4 my-1 w-[2.5rem]" />
        </header>

        <section className="mb-2">
          <Skeleton className="h-5 my-1 w-[8rem]" />
        </section>

        <footer>
          <Skeleton className="w-[4.125rem] h-[2.375rem] rounded-full" />
        </footer>
      </div>
    </div>
  )
}
