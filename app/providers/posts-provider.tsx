import { createContext } from "react"

const PostsContext = createContext({})

export default function PostsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PostsContext.Provider value={{ test: "salut" }}>
      {children}
    </PostsContext.Provider>
  )
}
