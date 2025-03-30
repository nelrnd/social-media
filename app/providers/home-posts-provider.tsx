"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { PostWithRelations } from "../lib/definitions"
import { fetchPosts } from "../lib/data"
import { v4 as uuidv4 } from "uuid"
import { useSession } from "next-auth/react"

type HomePostsContextType = {
  posts: PostWithRelations[]
  setPosts(posts: PostWithRelations[]): void
  hasMore: boolean
  loading: boolean
  loadMore(): void
  likePost(postId: string): void
}

const HomePostsContext = createContext<HomePostsContextType>(
  {} as HomePostsContextType
)

export default function HomePostsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useSession()
  const userId = session.data?.user.id
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

  function likePost(postId: string) {
    const post = posts.find((post) => post.id === postId)
    const hasLiked = post?.likes.find((like) => like.userId === userId)
    setPosts((posts) =>
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: hasLiked
                ? post.likes.filter((like) => like.userId !== userId)
                : post.likes,
            }
          : post
      )
    )
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
      value={{ posts, setPosts, hasMore, loading, loadMore, likePost }}
    >
      {children}
    </HomePostsContext.Provider>
  )
}

export function useHomePosts() {
  return useContext(HomePostsContext)
}
