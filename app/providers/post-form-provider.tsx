"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { NewPostButton } from "../ui/buttons"
import { usePathname } from "next/navigation"

interface PostFormContextType {
  setVisible(visible: boolean): void
  addCb: any
}

const PostFormContext = createContext<PostFormContextType>(
  {} as PostFormContextType
)

const disabledPathnames = ["/", "/settings/profile"]

export default function PostFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(
    !disabledPathnames.includes(pathname) && !pathname.startsWith("/post/")
  )

  const addCb = useRef(null)

  useEffect(() => {
    setVisible(
      !disabledPathnames.includes(pathname) && !pathname.startsWith("/post/")
    )
  }, [pathname])

  return (
    <PostFormContext.Provider value={{ setVisible, addCb }}>
      {children}

      {visible && (
        <div className="fixed right-8 bottom-[7rem] xl:bottom-8 z-50">
          <NewPostButton addCb={addCb.current} />
        </div>
      )}
    </PostFormContext.Provider>
  )
}

export function usePostForm() {
  return useContext(PostFormContext)
}
