"use client"

import { createContext, useState } from "react"
import { PostWithRelations } from "../lib/definitions"

type HomePostsContextType = {
  posts: PostWithRelations[]
  setPosts(posts: PostWithRelations[]): void
}

const HomePostsContext = createContext<HomePostsContextType>(
  {} as HomePostsContextType
)

export default function HomePostsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [posts, setPosts] = useState<PostWithRelations[]>([])

  return (
    <HomePostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </HomePostsContext.Provider>
  )
}
