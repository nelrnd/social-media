"use client"

import { useActionState } from "react"
import { CommentFormState, commentPost } from "../lib/actions"
import { Button } from "./buttons"
import { usePathname } from "next/navigation"
import { useHomePosts } from "../providers/home-posts-provider"

export default function CommentForm({
  postId,
  cb,
}: {
  postId: string
  cb?: (...args: any[]) => any
}) {
  const initialState: CommentFormState = {
    message: null,
    success: false,
    comment: null,
  }
  const { commentPost: commentHomePost } = useHomePosts()
  const [state, formAction, isPending] = useActionState(
    (state: CommentFormState, payload: FormData) => {
      if (cb) cb()
      commentHomePost(postId)
      return commentPost(state, payload)
    },
    initialState
  )
  const pathname = usePathname()

  return (
    <form action={formAction}>
      <textarea
        name="content"
        className="w-full h-6 sm:h-[4rem] mb-4 outline-none bg-transparent"
        placeholder="What do you have to say?"
        spellCheck="false"
      ></textarea>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="currentPath" value={pathname} />
      <div aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-danger">{state.message}</p>}
      </div>
      <Button isLoading={isPending} className="ml-auto">
        Reply
      </Button>
    </form>
  )
}
