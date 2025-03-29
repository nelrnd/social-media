"use client"

import { createContext, useContext, useState } from "react"
import { NewPostButton } from "../ui/buttons"
import { usePathname } from "next/navigation"

interface PostFormContextType {
  setVisible(visible: boolean): void
}

const PostFormContext = createContext<PostFormContextType>(
  {} as PostFormContextType
)

export default function PostFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(!(pathname === "/"))

  return (
    <PostFormContext.Provider value={{ setVisible }}>
      {children}

      {visible && (
        <div className="fixed right-8 bottom-[7rem] xl:bottom-8 z-50">
          <NewPostButton />
        </div>
      )}
    </PostFormContext.Provider>
  )
}

export function usePostForm() {
  return useContext(PostFormContext)
}
