"use client"

import { useActionState, useEffect, useState } from "react"
import { createPost, Image, PostFormState } from "@/app/lib/actions"
import { PhotoIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { v4 as uuidv4 } from "uuid"
import ImagePreview from "./image-preview"
import { Button } from "./buttons"
import { PostWithRelations } from "../lib/definitions"
import { useInView } from "react-intersection-observer"
import { usePostForm } from "../providers/post-form-provider"

const MAX_IMAGES = 4

export default function PostForm({
  handleAdd,
}: {
  handleAdd?: (post: PostWithRelations) => void
}) {
  const [images, setImages] = useState<Image[]>([])

  const initialState: PostFormState = {
    error: null,
    success: false,
    post: null,
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

  useEffect(() => {
    if (handleAdd && state.post) {
      handleAdd(state.post)
      state.post = null
    }
  }, [handleAdd, state])

  return (
    <form action={action} className="space-y-2">
      <textarea
        placeholder="What do you want to say?"
        className="w-full h-[4rem] outline-none bg-background"
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

      {state?.error && <p className="text-danger">{state.error}</p>}

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
            <div className="cursor-pointer size-12 flex items-center gap-4 justify-center  disabled:opacity-50 transition-all rounded-full relative bg-background border border-border hover:bg-subtle peer-disabled:opacity-50 peer-disabled:cursor-default peer-disabled:hover:bg-background">
              <span className="sr-only">Add images</span>
              <PhotoIcon className="size-5 text-soft" />
            </div>
          </label>
        </div>

        <Button isLoading={isPending}>Post</Button>
      </div>
    </form>
  )
}

export function PostFormWrapper() {
  const { ref, inView } = useInView({ threshold: 0.3 })
  const { setVisible } = usePostForm()

  useEffect(() => {
    setVisible(!inView)
  }, [inView])

  return (
    <div ref={ref}>
      <PostForm />
    </div>
  )
}
