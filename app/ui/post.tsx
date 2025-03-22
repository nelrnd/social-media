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
import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { Skeleton } from "./skeleton"

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
  const session = useSession()
  const userId = session.data?.user.id
  const fromMe = post.userId === userId

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
        <header className="flex items-center gap-2">
          <Link
            href={`/profile/${post.user.profile?.username}`}
            className="relative z-10 w-fit hover:underline"
          >
            <span className="font-bold">{post.user.profile?.name}</span>{" "}
            <span className="text-gray-600">{post.user.profile?.username}</span>
          </Link>
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

      {fromMe && <PostMenu />}
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

function PostMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="absolute top-2 right-2 cursor-pointer size-10 bg-white hover:bg-gray-100 border border-gray-100 flex items-center justify-center rounded-full transition-colors peer-disabled:opacity-50 peer-disabled:cursor-default peer-disabled:hover:bg-white">
          <span className="sr-only">Add images</span>
          <EllipsisHorizontalIcon className="size-5 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("delete")}>
          Delete post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
