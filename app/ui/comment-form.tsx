"use client"

import { useActionState, useEffect } from "react"
import { CommentFormState, commentPost } from "../lib/actions"
import { LoaderCircleIcon } from "lucide-react"

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
  const [state, formAction, isPending] = useActionState(
    commentPost,
    initialState
  )

  useEffect(() => {
    if (cb && state.comment) {
      cb(state.comment)
      state.comment = null
    }
  }, [cb, state])

  return (
    <form action={formAction}>
      <textarea
        name="content"
        className="w-full h-[4rem] mb-4 outline-none bg-transparent"
        placeholder="What do you have to say?"
        spellCheck="false"
      ></textarea>
      <input type="hidden" name="postId" value={postId} />
      <div aria-live="polite" aria-atomic="true">
        {state?.message && <p className="text-red-500">{state.message}</p>}
      </div>
      <button
        className="w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity rounded-sm ml-auto relative"
        disabled={isPending}
      >
        <span className={isPending ? "invisible" : ""}>Reply</span>
        {isPending && (
          <LoaderCircleIcon
            className="size-4 animate-spin absolute object-center"
            aria-label="Loading"
          />
        )}
      </button>
    </form>
  )
}
