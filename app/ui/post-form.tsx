"use client"

import { useActionState, useEffect, useState } from "react"
import { createPost, Image, PostFormState } from "@/app/lib/actions"
import { LoaderCircleIcon } from "lucide-react"
import { PhotoIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { v4 as uuidv4 } from "uuid"
import ImagePreview from "./image-preview"

const MAX_IMAGES = 4

export default function PostForm() {
  const [images, setImages] = useState<Image[]>([])

  const initialState: PostFormState = {
    error: null,
    success: false,
  }

  const [state, action, isPending] = useActionState(
    createPost.bind(null, images),
    initialState
  )

  function addImages(images: File[]) {
    setImages((prevImages) =>
      [
        ...prevImages,
        ...images.map((image) => ({
          file: image,
          id: uuidv4(),
          url: URL.createObjectURL(image),
        })),
      ].slice(0, MAX_IMAGES)
    )
  }

  function deleteImage(id: string) {
    setImages((prevImages) =>
      [...prevImages].filter((image) => image.id !== id)
    )
  }

  useEffect(() => {
    if (state.success) {
      setImages([])
    }
  }, [state])

  return (
    <form action={action} className="p-6 border-b border-gray-200 space-y-2">
      <textarea
        placeholder="What do you want to say?"
        className="w-full h-[4rem] outline-none"
        name="content"
      ></textarea>

      {!!images.length && (
        <div
          className={clsx("grid gap-2", {
            "grid-cols-1": images.length === 1,
            "grid-cols-2": images.length > 1,
          })}
        >
          {images.map((image) => (
            <ImagePreview
              key={image.id}
              src={image.url}
              handleDelete={() => deleteImage(image.id)}
            />
          ))}
        </div>
      )}

      {state?.error && <p className="text-red-500">{state.error}</p>}

      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="images">
            <input
              type="file"
              id="images"
              accept="image/jpeg, image/jpg, image/png, image/webp"
              multiple
              onChange={(e) =>
                e.target.files && addImages(Array.from(e.target.files))
              }
              className="hidden peer"
              disabled={images.length >= 4}
            />
            <div className="cursor-pointer size-12 bg-white hover:bg-gray-100 border border-gray-100 flex items-center justify-center rounded-full transition-colors peer-disabled:opacity-50 peer-disabled:cursor-default peer-disabled:hover:bg-white">
              <span className="sr-only">Add images</span>
              <PhotoIcon className="size-5 text-gray-600" />
            </div>
          </label>
        </div>
        <button
          className="w-fit h-[3.125rem] py-3 px-6 flex items-center justify-center bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity rounded-sm relative"
          disabled={isPending}
        >
          <span className={isPending ? "invisible" : "inline"}>Post</span>
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
