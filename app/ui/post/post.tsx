"use client"

import { Prisma } from "@prisma/client"
import moment from "moment"
import Link from "next/link"
import { fetchComments } from "@/app/lib/data"
import PostMenu from "./post-menu"
import clsx from "clsx"
import { LikeButton, CommentButton } from "../buttons"
import { usePathname } from "next/navigation"

/*
export default async function Post({
  post,
}: {
  post: Prisma.PostGetPayload<{
    include: { user: { select: { profile: true } }; likes: true }
  }>
}) {
  const comments = await fetchComments(post.id)

  return (
    <article className="border-b border-gray-200 relative hover:bg-gray-50 transition-colors">
      <div className="p-4 ">
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
          <time className="text-gray-600 text-sm">
            {moment(post.createdAt).format("LT")}
          </time>
        </header>
        <p>{post.content}</p>
      </div>
      <PostMenu postId={post.id} likes={post.likes} comments={comments} />
      <Link href={`/post/${post.id}`} className="absolute inset-0 z-0"></Link>
    </article>
  )
}
  */

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
        "p-6 border-b border-gray-200 relative space-y-2 transition-colors",
        {
          "hover:bg-gray-50": !onPage,
        }
      )}
    >
      <header className="flex items-center justify-between">
        <p className="relative z-10 w-fit">
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

      <section>
        <p>{post.content}</p>
      </section>

      <footer className="flex items-center gap-4">
        <LikeButton postId={post.id} likes={post.likes} />
        <CommentButton postId={post.id} comments={post.comments} />
      </footer>

      {!onPage && (
        <Link href={`/post/${post.id}`} className="absolute inset-0 z-0"></Link>
      )}
    </article>
  )
}
