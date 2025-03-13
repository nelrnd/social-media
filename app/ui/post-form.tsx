"use client"

import { useActionState } from "react"
import { createPost } from "@/app/lib/actions"
import { LoaderCircleIcon } from "lucide-react"

export default function PostForm() {
  const [formError, formAction, isPending] = useActionState(
    createPost,
    undefined
  )

  return (
    <form
      action={formAction}
      className="p-6 border-b border-gray-200 space-y-2"
    >
      <textarea
        placeholder="What do you want to say?"
        className="w-full h-[4rem] outline-none"
        name="content"
      ></textarea>
      {formError && <p className="text-red-500">{formError}</p>}
      <button
        className="w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity rounded-sm ml-auto relative"
        disabled={isPending}
      >
        <span className={isPending ? "invisible" : ""}>Post</span>
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
