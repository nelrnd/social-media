import { XMarkIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Image from "next/image"

export default function ImagePreview({
  src,
  handleDelete,
  handleClick,
}: {
  src: string
  handleDelete?: () => void
  handleClick?: () => void
}) {
  return handleClick ? (
    <button
      onClick={handleClick}
      className="press w-full aspect-square relative border border-border rounded-xl overflow-hidden transition-all z-10 hover:brightness-90"
    >
      {handleDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 left-2 z-10 cursor-pointer size-12 bg-background hover:bg-subtle border border-border flex items-center justify-center rounded-full transition-colors"
        >
          <span className="sr-only">Delete image</span>
          <XMarkIcon className="size-5 text-soft" />
        </button>
      )}

      <Image
        src={src}
        alt=""
        fill={true}
        sizes="(max-width: 770px) 100vw, 446px"
        className="absolute inset-0 object-cover"
      />
    </button>
  ) : (
    <div className="w-full aspect-square relative border border-border rounded-xl overflow-hidden transition-all">
      {handleDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 left-2 z-10 cursor-pointer size-12 bg-background hover:bg-subtle border border-border flex items-center justify-center rounded-full transition-colors"
        >
          <span className="sr-only">Delete image</span>
          <XMarkIcon className="size-5 text-soft" />
        </button>
      )}

      <Image
        src={src}
        alt=""
        fill={true}
        sizes="(max-width: 770px) 100vw, 446px"
        className="absolute inset-0 object-cover"
      />

      {handleClick && (
        <button onClick={handleClick} className="absolute inset-0">
          <span className="sr-only">View in fullscreen</span>
        </button>
      )}
    </div>
  )
}
