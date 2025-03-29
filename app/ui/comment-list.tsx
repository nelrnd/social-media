"use client"

import Comment, { CommentSkeleton } from "./comment"
import { CommentWithRelations } from "../lib/definitions"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { fetchComments } from "../lib/data"

export default function CommentList({
  initialComments,
  initialHasMoreComments,
  postId,
}: {
  initialComments: CommentWithRelations[]
  initialHasMoreComments: boolean
  postId: string
}) {
  const { ref, inView } = useInView()
  const [comments, setComments] = useState(initialComments)
  const [hasMoreComments, setHasMoreComments] = useState(initialHasMoreComments)
  const [isLoading, setIsLoading] = useState(inView && hasMoreComments)

  useEffect(() => {
    let ignore = false
    if (inView && hasMoreComments) {
      ;(async () => {
        const cursor = comments.at(-1)?.id
        setIsLoading(true)
        const { comments: newComments, hasMoreComments } = await fetchComments({
          postId,
          cursor,
        })
        if (!ignore) {
          setComments((prevComments) => [...prevComments, ...newComments])
          setHasMoreComments(hasMoreComments)
          setIsLoading(false)
        }
      })()
    }
    return () => {
      ignore = true
    }
  }, [inView, hasMoreComments, comments, postId])

  return (
    <div>
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <div ref={ref} className="h-[1px]" />
      {isLoading &&
        [...Array(3).keys()].map((item) => <CommentSkeleton key={item} />)}
      {!hasMoreComments && comments.length === 0 && (
        <div className="p-6 text-center text-soft">No comments for now</div>
      )}
    </div>
  )
}
