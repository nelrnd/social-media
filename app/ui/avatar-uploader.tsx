"use client"

import { useState } from "react"
import Avatar from "./avatar"
import { CameraIcon } from "@heroicons/react/24/outline"

export default function AvatarUploader({
  initialImage,
  errors,
}: {
  initialImage?: string | null
  errors?: string[]
}) {
  const [files, setFiles] = useState<FileList | null>(null)
  const url = files && files.length ? URL.createObjectURL(files[0]) : null

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/webp"
        id="image"
        name="image"
        className="hidden"
        onChange={(e) => setFiles(e.target.files || null)}
      />
      <label
        htmlFor="image"
        className="rounded-full overflow-hidden block w-fit h-fit relative"
      >
        <div
          className="cursor-pointer bg-black/20 hover:bg-black/40 absolute inset-0 transition-colors grid place-content-center z-10"
          title="Upload image"
        >
          <CameraIcon className="size-10 text-white" />
        </div>
        <Avatar src={url || initialImage} size="lg" />
      </label>
      <div id="image-error" aria-live="polite" aria-atomic="true">
        {errors && <p className="text-red-500 text-sm mt-1">{errors.at(0)}</p>}
      </div>
    </div>
  )
}
