"use client"

import { useActionState } from "react"
import { createPost } from "../lib/actions"

export default function PostForm() {
  const [state, formAction] = useActionState(createPost, undefined) // to be modified

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
      <button className="block w-fit ml-auto py-2 px-6 bg-gray-900 text-white">
        Post
      </button>
    </form>
  )
}
