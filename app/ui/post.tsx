"use client"

import { Prisma } from "@prisma/client"
import Link from "next/link"
import clsx from "clsx"
import { LikeButton, CommentButton } from "./buttons"
import { usePathname } from "next/navigation"
import Date from "./date"
import Avatar from "./avatar"
import ImagePreview from "./image-preview"
import PostLikes from "./post-likes"

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
      <Link
        href={`/profile/${post.user.profile?.username}`}
        className="relative z-10 w-fit h-fit rounded-full hover:brightness-90 transition-all"
      >
        <Avatar src={post.user.profile?.imageUrl} size="md" />
      </Link>
      <div className="flex flex-col gap-2">
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
        {post.content && (
          <section className="-mt-2">
            <p>{post.content}</p>
          </section>
        )}
        {post.images && !!post.images.length && (
          <div
            className={clsx("grid gap-2", {
              "grid-cols-1": post.images.length === 1,
              "grid-cols-2": post.images.length > 1,
            })}
          >
            {post.images.map((image) => (
              <ImagePreview key={image} src={image} />
            ))}
          </div>
        )}
        <footer className="flex items-center gap-4">
          <LikeButton postId={post.id} likes={post.likes} />
          <CommentButton post={post} comments={post.comments} />
          {onPage && (
            <PostLikes
              postId={post.id}
              count={post.likes.length}
              className="ml-auto"
            />
          )}
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
      <Avatar src={post.user.profile?.imageUrl} size="md" />
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

        {post.images && !!post.images.length && (
          <div
            className={clsx("grid gap-2", {
              "grid-cols-1": post.images.length === 1,
              "grid-cols-2": post.images.length > 1,
            })}
          >
            {post.images.map((image) => (
              <ImagePreview key={image} src={image} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
