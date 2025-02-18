"use client"

import { useActionState } from "react"
import { commentPost } from "../lib/actions"

export default function CommentForm({ postId }: { postId: string }) {
  const [formError, formAction, isPending] = useActionState(
    commentPost,
    undefined
  )

  return (
    <form action={formAction}>
      <textarea
        name="content"
        className="w-full h-[4rem] p-2"
        placeholder="Type in your comment"
      ></textarea>
      <input type="hidden" name="postId" value={postId} />
      <div aria-live="polite" aria-atomic="true">
        {formError && <p className="text-red-500">{formError}</p>}
      </div>
      <button
        className="block w-fit ml-auto text-sm py-1 px-3 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity"
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Reply"}
      </button>
    </form>
  )
}
