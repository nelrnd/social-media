import { XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

export default function ImagePreview({
  src,
  handleDelete,
}: {
  src: string
  handleDelete?: () => void
}) {
  return (
    <div className="w-full aspect-square relative border border-gray-100 rounded-xl overflow-hidden">
      {handleDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 left-2 z-10 cursor-pointer size-12 bg-white hover:bg-gray-100 border border-gray-100 flex items-center justify-center rounded-full transition-colors"
        >
          <span className="sr-only">Delete image</span>
          <XMarkIcon className="size-5 text-gray-600" />
        </button>
      )}

      <Image
        src={src}
        alt=""
        fill={true}
        sizes="(max-width: 770px) 100vw, 446px"
        className="absolute inset-0 object-cover"
      />
    </div>
  )
}
