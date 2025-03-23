"use client"

import { likeComment, likePost } from "../lib/actions"
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
import { useEffect, useState } from "react"
import { spaceMono } from "../fonts"
import clsx from "clsx"
import { LoaderCircleIcon } from "lucide-react"
import { Skeleton } from "./skeleton"
import { PostWithRelations } from "../lib/definitions"

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
    <button
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
      className={`text-sm ${spaceMono.className} py-2 px-4 flex items-center gap-2 w-fit bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors relative z-10`}
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
    </button>
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
        <button
          className={`text-sm ${spaceMono.className} py-2 px-4 flex items-center gap-2 w-fit bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors relative z-10`}
          aria-label="Comment post"
          title="Comment"
        >
          <ChatBubbleLeftIcon className="size-4" />

          <div className="h-5 overflow-hidden">
            <div
              className={clsx("-translate-y-1/2", animating && "animate-rise")}
            >
              <p aria-hidden={true}>{prevCommentCount}</p>
              <p>{commentCount}</p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comment</DialogTitle>
          <DialogDescription className="sr-only">
            Post a comment to post
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
    <button
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
      className={`text-sm ${spaceMono.className} py-2 px-3 flex items-center gap-2 w-fit bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors relative z-10`}
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
    </button>
  )
}

export function Button({
  children,
  onClick,
  className,
  disabled = false,
  isLoading = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  isLoading?: boolean
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      className={clsx(
        "w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:bg-gray-800 transition-all rounded-sm relative",
        className
      )}
      disabled={disabled || isLoading}
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
