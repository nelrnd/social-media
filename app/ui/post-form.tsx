"use client"

import { useActionState } from "react"
import { createPost } from "../lib/actions"

export default function PostForm() {
  const [formError, formAction, isPending] = useActionState(
    createPost,
    undefined
  )

  return (
    <form
      action={formAction}
      className="p-4 border-b border-gray-200 space-y-2"
    >
      <textarea
        placeholder="What do you want to say?"
        className="w-full h-[4rem] p-2"
        name="content"
      ></textarea>
      {formError && <p className="text-red-500">{formError}</p>}
      <button
        className="block w-fit ml-auto py-2 px-6 bg-gray-900 text-white"
        aria-disabled={isPending}
      >
        Post
      </button>
    </form>
  )
}
