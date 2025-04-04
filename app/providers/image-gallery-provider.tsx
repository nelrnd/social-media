"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/ui/dialog"
import Image from "next/image"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import Avatar from "../ui/avatar"

interface ImageGalleryContextType {
  openGallery({
    currentId,
    images,
    isAvatar,
  }: {
    currentId?: number
    images: string[]
    isAvatar?: boolean
  }): void
}

const ImageGalleryContext = createContext<ImageGalleryContextType>(
  {} as ImageGalleryContextType
)

export default function ImageGalleryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [asAvatar, setAsAvatar] = useState(false)

  const currentImage = currentId !== null && images[currentId]

  function openGallery({
    currentId = 0,
    images,
    isAvatar = false,
  }: {
    currentId?: number
    images: string[]
    isAvatar?: boolean
  }) {
    if (!images || images.length < 1) return
    setCurrentId(currentId)
    if (images) {
      setImages(images)
    }
    if (isAvatar) {
      setAsAvatar(true)
    }
    setOpen(true)
  }

  function closeGallery() {
    setCurrentId(null)
    setImages([])
    setOpen(false)
    setAsAvatar(false)
  }

  const next = useCallback(() => {
    setCurrentId((prevId) =>
      prevId === null ? prevId : prevId < images.length - 1 ? prevId + 1 : 0
    )
  }, [setCurrentId, images.length])

  const back = useCallback(() => {
    setCurrentId((prevId) =>
      prevId === null ? prevId : prevId > 0 ? prevId - 1 : images.length - 1
    )
  }, [setCurrentId, images.length])

  useEffect(() => {
    function handleKeyDown(this: HTMLElement, event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowRight":
          next()
          break
        case "ArrowLeft":
          back()
          break
        default:
          return
      }
    }

    if (open) {
      document.body.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.removeEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, next, back])

  return (
    <ImageGalleryContext.Provider value={{ openGallery }}>
      {children}

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeGallery()
        }}
      >
        <DialogContent
          className="p-0 w-full h-full sm:max-w-full sm:h-full sm:max-h-full sm:rounded-none bg-black/80 border-black flex flex-col"
          hideCloseButton={true}
        >
          <DialogTitle className="sr-only">Image gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Browse through gallery
          </DialogDescription>

          <button
            onClick={closeGallery}
            className="fixed z-20 top-2 left-2 sm:top-4 sm:left-4 cursor-pointer size-12 bg-black hover:bg-gray-950 border border-gray-950 flex items-center justify-center rounded-full transition-colors"
          >
            <span className="sr-only">Close image</span>
            <XMarkIcon className="size-5 text-white" />
          </button>

          {currentImage && (
            <main className="mx-8 my-8 sm:mx-32 sm:my-32 flex-1 relative flex items-center justify-center">
              {asAvatar ? (
                <Avatar
                  src={currentImage}
                  className="w-64 h-64 sm:w-64 sm:h-64 max-w-full max-h-auto"
                />
              ) : (
                <Image
                  src={currentImage}
                  alt=""
                  fill={true}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </main>
          )}

          {images.length > 1 && (
            <nav className="fixed z-20 w-full px-2 sm:px-4 top-1/2 -translate-y-1/2 h-10 flex items-center justify-between pointer-events-none">
              <button
                onClick={back}
                className="pointer-events-auto cursor-pointer size-12 bg-black hover:bg-gray-950 border border-gray-950 flex items-center justify-center rounded-full transition-colors"
              >
                <span className="sr-only">Go to previous image</span>
                <ArrowLeftIcon className="size-5 text-white" />
              </button>
              <button
                onClick={next}
                className="pointer-events-auto cursor-pointer size-12 bg-black hover:bg-gray-950 border border-gray-950 flex items-center justify-center rounded-full transition-colors"
              >
                <span className="sr-only">Go to next image</span>
                <ArrowRightIcon className="size-5 text-white" />
              </button>
            </nav>
          )}

          {images.length > 1 && (
            <footer className="pointer-events-none fixed z-20 bottom-0 w-full p-4 border-t border-white/5 flex items-center justify-center gap-4">
              {images.map((image, id) => (
                <button
                  key={image}
                  onClick={() => setCurrentId(id)}
                  className={clsx(
                    "pointer-events-auto size-16 rounded-lg overflow-hidden relative z-10",
                    {
                      "ring-2 ring-white ring-offset-4 ring-offset-black/95":
                        currentId !== null && id === currentId,
                    }
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    width={128}
                    height={128}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </footer>
          )}

          <div className="absolute inset-0" onClick={closeGallery}></div>
        </DialogContent>
      </Dialog>
    </ImageGalleryContext.Provider>
  )
}

export function useImageGallery() {
  return useContext(ImageGalleryContext)
}
