"use client"

import { Prisma } from "@prisma/client"
import Link from "next/link"
import clsx from "clsx"
import { LikeButton, CommentButton } from "./buttons"
import { usePathname } from "next/navigation"
import { getDate } from "../lib/utils"
import Date from "./date"
import Avatar from "./avatar"

export default function Post({
  post,
}: {
  post: Prisma.PostGetPayload<{
    include: {
      user: { select: { profile: true } }
      likes: { select: { id: true; userId: true } }
      comments: { select: { id: true } }
    }
  }>
}) {
  const pathname = usePathname()
  const onPage = pathname.startsWith(`/post/${post.id}`)

  return (
    <article
      className={clsx(
        "p-6 border-b border-gray-200 relative grid grid-cols-[auto_1fr] gap-4 transition-colors",
        {
          "hover:bg-gray-50": !onPage,
        }
      )}
    >
      <Avatar src="" size="md" />
      <div className="space-y-2">
        <header className="flex items-center justify-between">
          <p className="relative z-10 w-fit">
            <Link
              href={`/profile/${post.user.profile?.username}`}
              className="hover:underline"
            >
              <span className="font-bold">{post.user.profile?.name}</span>{" "}
              <span className="text-gray-600">
                {post.user.profile?.username}
              </span>
            </Link>
          </p>
          <Date date={post.createdAt} />
        </header>
        <section>
          <p>{post.content}</p>
        </section>
        <footer className="flex items-center gap-4">
          <LikeButton postId={post.id} likes={post.likes} />
          <CommentButton post={post} comments={post.comments} />
        </footer>
      </div>

      {!onPage && (
        <Link href={`/post/${post.id}`} className="absolute inset-0 z-0"></Link>
      )}
    </article>
  )
}

export function PostMinimized({
  post,
}: {
  post: Prisma.PostGetPayload<{
    include: {
      user: { select: { profile: true } }
    }
  }>
}) {
  return (
    <article className="p-4 border border-gray-200 rounded-md grid grid-cols-[auto_1fr] gap-3">
      <Avatar src="" size="md" />
      <div className="space-y-2">
        <header className="flex items-center justify-between">
          <p className="relative z-10 w-fit">
            <span className="font-bold">{post.user.profile?.name}</span>{" "}
            <span className="text-gray-600">{post.user.profile?.username}</span>
          </p>
          <Date date={post.createdAt} />
        </header>

        <section>
          <p>{post.content}</p>
        </section>
      </div>
    </article>
  )
}
