"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { PostWithRelations } from "../lib/definitions"
import { fetchPosts } from "../lib/data"

type HomePostsContextType = {
  posts: PostWithRelations[]
  setPosts(posts: PostWithRelations[]): void
  hasMore: boolean
  loading: boolean
  loadMore(): void
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
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    if (hasMore && !loading) {
      const cursor = posts.at(-1)?.id
      setLoading(true)
      const { posts: newPosts, hasMorePosts } = await fetchPosts({ cursor })
      setPosts((prevPosts) => [...prevPosts, ...newPosts])
      setHasMore(hasMorePosts)
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadInitial() {
      setLoading(true)
      const { posts: initialPosts, hasMorePosts } = await fetchPosts({})
      setPosts(initialPosts)
      setHasMore(hasMorePosts)
      setLoading(false)
    }
    loadInitial()
  }, [])

  return (
    <HomePostsContext.Provider
      value={{ posts, setPosts, hasMore, loading, loadMore }}
    >
      {children}
    </HomePostsContext.Provider>
  )
}

export function useHomePosts() {
  return useContext(HomePostsContext)
}
