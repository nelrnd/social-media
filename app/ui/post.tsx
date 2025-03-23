"use client"

import clsx from "clsx"
import { Prisma } from "@prisma/client"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { LikeButton, CommentButton } from "./buttons"
import { Skeleton } from "./skeleton"
import Date from "./date"
import Avatar from "./avatar"
import ImagePreview from "./image-preview"
import PostLikes from "./post-likes"
import { PostWithRelations } from "../lib/definitions"
import PostMenu from "./post-menu"
import ProfileHoverCard from "./profile-hover-card"

export default function Post({ post }: { post: PostWithRelations }) {
  const pathname = usePathname()
  const onPage = pathname.startsWith(`/post/${post.id}`)
  const session = useSession()
  const userId = session.data?.user.id
  const fromMe = post.userId === userId

  if (!post.user.profile) return null

  return (
    <article
      className={clsx(
        "p-6 border-b border-gray-200 relative grid grid-cols-[auto_1fr] gap-4 transition-colors",
        {
          "hover:bg-gray-50": !onPage,
        }
      )}
    >
      <ProfileHoverCard profile={post.user.profile}>
        <Link
          href={`/profile/${post.user.profile?.username}`}
          className="relative z-10 w-fit h-fit rounded-full hover:brightness-90 transition-all"
        >
          <Avatar src={post.user.profile?.imageUrl} size="md" />
        </Link>
      </ProfileHoverCard>

      <div className="flex flex-col gap-2">
        <header className="flex items-center gap-2">
          <ProfileHoverCard profile={post.user.profile}>
            <Link
              href={`/profile/${post.user.profile?.username}`}
              className="relative z-10 w-fit hover:underline"
            >
              <span className="font-bold">{post.user.profile?.name}</span>{" "}
              <span className="text-gray-600">
                {post.user.profile?.username}
              </span>
            </Link>
          </ProfileHoverCard>
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
          <LikeButton
            postId={post.id}
            userId={userId}
            initialLikes={post.likes}
          />
          <CommentButton post={post} initialComments={post.comments} />
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

      {fromMe && <PostMenu postId={post.id} />}
    </article>
  )
}

export function PostSkeleton() {
  return (
    <article className="p-6 border-b border-gray-200 grid grid-cols-[auto_1fr] gap-4">
      <Skeleton className="size-16 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[100px] my-[2px]" />
        <Skeleton className="h-4 w-[200px] my-[2px]" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-[37px] w-[66px]" />
          <Skeleton className="h-[37px] w-[66px]" />
        </div>
      </div>
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
      <Avatar src={post.user.profile?.imageUrl} size="sm" />
      <div className="flex flex-col gap-2">
        <header className="flex items-center justify-between">
          <p className="relative z-10 w-fit">
            <span className="font-bold">{post.user.profile?.name}</span>{" "}
            <span className="text-gray-600">{post.user.profile?.username}</span>
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
      </div>
    </article>
  )
}
