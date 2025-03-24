"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/ui/dialog"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"

const ImageGalleryContext = createContext({
  text: "yes",
  openGallery({ currentId, images }: { currentId?: number; images: string[] }) {
    console.log(
      `opening ${images.length} images starting at index ${currentId}`
    )
  },
})

export default function ImageGalleryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])

  const currentImage = currentId !== null && images[currentId]

  function openGallery({
    currentId = 0,
    images,
  }: {
    currentId?: number
    images: string[]
  }) {
    if (!images || images.length < 1) return
    setCurrentId(currentId)
    if (images) {
      setImages(images)
    }
    setOpen(true)
  }

  function closeGallery() {
    setCurrentId(null)
    setImages([])
    setOpen(false)
  }

  function goNext() {
    setCurrentId((prevId) =>
      prevId === null ? prevId : prevId < images.length - 1 ? prevId + 1 : 0
    )
  }

  function goPrevious() {
    setCurrentId((prevId) =>
      prevId === null ? prevId : prevId > 0 ? prevId - 1 : images.length - 1
    )
  }

  function handleKeyDown(this: HTMLElement, event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight":
        goNext()
        break
      case "ArrowLeft":
        goPrevious()
        break
      default:
        return
    }
  }

  useEffect(() => {
    if (open) {
      document.body.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.removeEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const contextValue = {
    text: "yes",
    openGallery,
  }

  return (
    <ImageGalleryContext.Provider value={contextValue}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 h-full max-w-full sm:rounded-none bg-black/80 border-black flex flex-col">
          <DialogTitle className="sr-only">Image gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Browse through gallery
          </DialogDescription>

          <button
            onClick={closeGallery}
            className="fixed z-20 top-8 left-8 cursor-pointer size-12 bg-black hover:bg-gray-950 border border-gray-950 flex items-center justify-center rounded-full transition-colors"
          >
            <span className="sr-only">Close image</span>
            <XMarkIcon className="size-5 text-white" />
          </button>

          <main className="flex-1 p-8 flex justify-center items-center relative">
            {currentImage && (
              <Image src={currentImage} alt="" width="400" height="400" />
            )}
          </main>

          {images.length > 1 && (
            <footer className="p-4 border-t border-gray-900 flex items-center justify-center gap-4 relative z-10">
              {images.map((image, id) => (
                <button
                  key={image}
                  onClick={() => setCurrentId(id)}
                  className={clsx(
                    "size-16 rounded-lg overflow-hidden relative",
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
