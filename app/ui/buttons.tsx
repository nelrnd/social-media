"use client"

import { followProfile, likeComment, likePost } from "../lib/actions"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline"
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"
import { Prisma } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import CommentForm from "./comment-form"
import { PostMinimized } from "./post"
import { useState } from "react"
import { spaceMono } from "../fonts"
import clsx from "clsx"
import { LoaderCircleIcon } from "lucide-react"
import { Skeleton } from "./skeleton"
import { PostWithRelations } from "../lib/definitions"

export function Press({
  children,
  light = false,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <div
      className={`cursor-pointer ${light ? "active:scale-95" : "active:scale-90"} transition-transform will-change-transform relative z-10`}
    >
      {children}
    </div>
  )
}

function ActionButton({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Press>
      <button
        className={`${spaceMono.className} text-sm py-2 px-4 rounded-full flex items-center gap-2 w-fit bg-background border border-border hover:bg-subtle disabled:opacity-50 transition-colors relative z-10`}
        {...props}
      >
        {children}
      </button>
    </Press>
  )
}

export function LikeButton({
  postId,
  userId,
  initialLikes,
}: {
  postId: string
  userId?: string
  initialLikes: Prisma.LikeGetPayload<{ select: { id: true; userId: true } }>[]
}) {
  const [likes, setLikes] = useState(initialLikes)
  const hasLiked = !!likes.find((like) => like.userId === userId)
  const [actionId, setActionId] = useState<string | null>(null)

  const likeCount = likes.length
  const prevLikeCount = hasLiked ? likeCount - 1 : likeCount + 1

  return (
    <ActionButton
      onClick={async () => {
        if (!userId) return
        const currentActionId = uuidv4()
        setActionId(currentActionId)
        setLikes((prevLikes) =>
          hasLiked
            ? prevLikes.filter((like) => like.userId !== userId)
            : [...prevLikes, { id: uuidv4(), userId }]
        )
        const { likes } = await likePost(postId)
        if (likes && actionId === currentActionId) {
          setLikes(likes)
        }
      }}
      aria-label={hasLiked ? "Unlike post" : "Like post"}
      title="Like"
    >
      {!userId ? (
        <>
          <Skeleton className="size-4 rounded-sm" />
          <p>{likeCount}</p>
        </>
      ) : (
        <>
          {hasLiked ? (
            <HeartIconSolid className="size-4 fill-red-500" />
          ) : (
            <HeartIconOutline className="size-4" />
          )}

          <div className="h-5 overflow-hidden">
            <div
              className={clsx("transition-transform", {
                "-translate-y-1/2": likeCount > prevLikeCount,
                "translate-y-0": likeCount <= prevLikeCount,
              })}
            >
              {likeCount > prevLikeCount ? (
                <>
                  <p aria-hidden={true}>{prevLikeCount}</p>
                  <p>{likeCount}</p>
                </>
              ) : (
                <>
                  <p>{likeCount}</p>
                  <p aria-hidden={true}>{prevLikeCount}</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </ActionButton>
  )
}

export function CommentButton({
  post,
  initialComments,
}: {
  post: PostWithRelations
  initialComments: Prisma.CommentGetPayload<{
    select: { id: true }
  }>[]
}) {
  const [comments, setComments] = useState(initialComments)
  const [open, setOpen] = useState(false)
  const [animating, setAnimating] = useState(false)

  const commentCount = comments.length
  const prevCommentCount = commentCount - 1

  function animate() {
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
    }, 150)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionButton aria-label="Comment post" title="Comment">
          <ChatBubbleLeftIcon className="size-4" />

          <div className="h-5 overflow-hidden">
            <div
              className={clsx("-translate-y-1/2", animating && "animate-rise")}
            >
              <p aria-hidden={true}>{prevCommentCount}</p>
              <p>{commentCount}</p>
            </div>
          </div>
        </ActionButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comment</DialogTitle>
          <DialogDescription className="sr-only">
            Post a comment
          </DialogDescription>
        </DialogHeader>
        <PostMinimized post={post} />
        <CommentForm
          postId={post.id}
          cb={(newComment) => {
            setOpen(false)
            setComments([...comments, newComment])
            animate()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export function LikeCommentButton({
  commentId,
  userId,
  initialLikes,
}: {
  commentId: string
  userId?: string
  initialLikes: Prisma.LikeGetPayload<{ select: { id: true; userId: true } }>[]
}) {
  const [likes, setLikes] = useState(initialLikes)
  const hasLiked = !!likes.find((like) => like.userId === userId)
  const [actionId, setActionId] = useState<string | null>(null)

  const likeCount = likes.length
  const prevLikeCount = hasLiked ? likeCount - 1 : likeCount + 1

  return (
    <ActionButton
      onClick={async () => {
        if (!userId) return
        const currentActionId = uuidv4()
        setActionId(currentActionId)
        setLikes((prevLikes) =>
          hasLiked
            ? prevLikes.filter((like) => like.userId !== userId)
            : [...prevLikes, { id: uuidv4(), userId }]
        )
        const { likes } = await likeComment(commentId)
        if (likes && actionId === currentActionId) {
          setLikes(likes)
        }
      }}
      aria-label={hasLiked ? "Unlike comment" : "Like comment"}
      title="Like"
    >
      {!userId ? (
        <>
          <Skeleton className="size-4 rounded-sm" />
          <p>{likeCount}</p>
        </>
      ) : (
        <>
          {hasLiked ? (
            <HeartIconSolid className="size-4 fill-red-500" />
          ) : (
            <HeartIconOutline className="size-4" />
          )}

          <div className="h-5 overflow-hidden">
            <div
              className={clsx("transition-transform", {
                "-translate-y-1/2": likeCount > prevLikeCount,
                "translate-y-0": likeCount <= prevLikeCount,
              })}
            >
              {likeCount > prevLikeCount ? (
                <>
                  <p aria-hidden={true}>{prevLikeCount}</p>
                  <p>{likeCount}</p>
                </>
              ) : (
                <>
                  <p>{likeCount}</p>
                  <p aria-hidden={true}>{prevLikeCount}</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </ActionButton>
  )
}

export function FollowButton({
  profileId,
  isFollowing,
}: {
  profileId: string
  isFollowing: boolean
}) {
  return (
    <button
      onClick={() => followProfile(profileId)}
      className={clsx(
        "w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center  disabled:opacity-50  transition-all rounded-sm relative",
        {
          "border border-gray-200 hover:bg-gray-100": isFollowing,
          "bg-gray-900 text-white hover:bg-gray-800": !isFollowing,
        }
      )}
    >
      {!isFollowing ? "Follow" : "Unfollow"}
    </button>
  )
}

export function Button({
  children,
  variant = "default",
  className,
  isLoading = false,
  ...props
}: {
  children: React.ReactNode
  variant?: string
  className?: string
  isLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center  disabled:opacity-50 transition-all rounded-sm relative",
        {
          "text-background bg-foreground hover:bg-subtle-foreground":
            variant === "default",
          "bg-white border border-gray-200 hover:bg-gray-100":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
        },
        className
      )}
      disabled={isLoading || props.disabled}
    >
      <div
        className={clsx(
          "flex items-center justify-center",
          isLoading && "invisible"
        )}
      >
        {children}
      </div>
      {isLoading && (
        <LoaderCircleIcon
          className="size-4 animate-spin absolute object-center"
          aria-label="Loading"
        />
      )}
    </button>
  )
}
