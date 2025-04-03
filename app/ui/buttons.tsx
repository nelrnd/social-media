"use client"

import { followProfile, likeComment, likePost } from "../lib/actions"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import {
  HeartIcon as HeartIconOutline,
  PlusIcon,
} from "@heroicons/react/24/outline"
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
import PostForm from "./post-form"
import { useHomePosts } from "../providers/home-posts-provider"

function ActionButton({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${spaceMono.className} text-sm py-2 px-4 rounded-full flex items-center gap-2 w-fit bg-background border border-border hover:bg-subtle disabled:opacity-50 transition-all relative z-10 press`}
      {...props}
    >
      {children}
    </button>
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

  const { likePost: likeHomePost } = useHomePosts()

  const likeCount = likes.length
  const prevLikeCount = hasLiked ? likeCount - 1 : likeCount + 1

  return (
    <ActionButton
      onClick={async () => {
        if (!userId) return
        const currentActionId = uuidv4()
        setActionId(currentActionId)
        likeHomePost(postId)
        setLikes((prevLikes) =>
          hasLiked
            ? prevLikes.filter((like) => like.userId !== userId)
            : [...prevLikes, { id: uuidv4(), userId }]
        )
        const { likes } = await likePost(postId)
        if (likes && actionId === currentActionId) {
          likeHomePost(postId, likes)
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
  const prevCommentCount = Math.abs(commentCount - 1)

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
  className,
}: {
  profileId: string
  isFollowing: boolean
  className?: string
}) {
  return (
    <Button
      onClick={() => followProfile(profileId)}
      variant={isFollowing ? "secondary" : "default"}
      className={className}
    >
      {!isFollowing ? "Follow" : "Unfollow"}
    </Button>
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
        "w-fit h-[3.125rem] py-3 px-6 flex items-center gap-4 justify-center  disabled:opacity-50 transition-all rounded-sm relative press",
        {
          "text-background dark:text-foreground bg-accent hover:bg-accent-variant":
            variant === "default",
          "bg-background border border-border hover:bg-subtle":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
        },
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <div
        className={clsx(
          "flex items-center justify-center gap-3",
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

export function NewPostButton() {
  const [open, setOpen] = useState(false)
  const { addPost } = useHomePosts()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4 text-background dark:text-foreground -ml-1" />
          <span className="sm:hidden">New</span>
          <span className="hidden sm:inline">New post</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="sr-only">Create new post</DialogTitle>
          <DialogDescription className="sr-only">
            This form allows you to create a new post
          </DialogDescription>
        </DialogHeader>
        <PostForm
          handleAdd={(newPost) => {
            addPost(newPost)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
