"use client"

import { createContext, useContext, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import Image from "next/image"

const ImageGalleryContext = createContext({
  text: "yes",
  openGallery: (imageUrl: string) => {},
})

export default function ImageGalleryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  function openGallery(imageUrl: string) {
    setCurrentImageUrl(imageUrl)
    setOpen(true)
    console.log(imageUrl)
  }

  function closeGallery() {
    setCurrentImageUrl(null)
    setOpen(false)
  }

  const contextValue = {
    text: "yes",
    openGallery,
  }

  return (
    <ImageGalleryContext.Provider value={contextValue}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-full max-w-full sm:rounded-none bg-black/80 border-black flex flex-col">
          <DialogTitle className="sr-only">Image gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Browse through gallery
          </DialogDescription>

          <main className="flex-1 p-8 flex justify-center items-center relative">
            {currentImageUrl && (
              <Image src={currentImageUrl} alt="" width="400" height="400" />
            )}
          </main>

          <div className="absolute inset-0" onClick={closeGallery}></div>
        </DialogContent>
      </Dialog>
    </ImageGalleryContext.Provider>
  )
}

export function useImageGallery() {
  return useContext(ImageGalleryContext)
}
