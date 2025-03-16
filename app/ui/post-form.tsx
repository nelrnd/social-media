"use client"

import { useActionState, useState } from "react"
import { createPost } from "@/app/lib/actions"
import { LoaderCircleIcon } from "lucide-react"
import { PhotoIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import clsx from "clsx"

export default function PostForm() {
  const [formError, formAction, isPending] = useActionState(
    createPost,
    undefined
  )

  const [images, setImages] = useState<FileList | null>(null)

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

      {images && images.length && (
        <div
          className={clsx("grid gap-2", {
            "grid-cols-1": images.length === 1,
            "grid-cols-2": images.length > 1,
          })}
        >
          {Array.from(images)
            .map((image) => URL.createObjectURL(image))
            .map((imageUrl) => (
              <ImagePreview key={imageUrl} src={imageUrl} />
            ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <input
            type="file"
            accept="image/*"
            multiple={true}
            onChange={(e) => setImages(e.target.files)}
            className="hidden"
            name="image"
            id="image"
          />
          <label
            htmlFor="image"
            className="cursor-pointer size-12 bg-white hover:bg-gray-100 flex items-center justify-center rounded-full transition-all"
          >
            <PhotoIcon className="size-5 text-gray-600" />
          </label>
        </div>

        <button
          className="w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity rounded-sm relative"
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
      </div>
    </form>
  )
}

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="w-full aspect-square relative border border-gray-100 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt=""
        layout="fill"
        objectFit="contain"
        className="absolute inset-0"
      />
    </div>
  )
}
