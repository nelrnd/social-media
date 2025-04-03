"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { PostWithRelations } from "../lib/definitions"
import { fetchPosts } from "../lib/data"
import { v4 as uuidv4 } from "uuid"
import { useSession } from "next-auth/react"
import { Prisma } from "@prisma/client"

type HomePostsContextType = {
  posts: PostWithRelations[]
  hasMore: boolean
  loading: boolean
  loadMore(): void
  likePost(
    postId: string,
    newLikes?: Prisma.LikeGetPayload<{ select: { userId: true; id: true } }>[]
  ): void
  commentPost(
    postId: string,
    newComments?: Prisma.CommentGetPayload<{
      select: { id: true }
    }>[]
  ): void
  addPost(newPost: PostWithRelations): void
  feedMode: "discover" | "following"
  setFeedMode(mode: "discover" | "following"): void
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
  const [discoverPosts, setDiscoverPosts] = useState<PostWithRelations[]>([])
  const [followingPosts, setFollowingPosts] = useState<PostWithRelations[]>([])
  const [discoverHasMore, setDiscoverHasMore] = useState(true)
  const [followingHasMore, setFollowingHasMore] = useState(true)
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [followingLoading, setFollowingLoading] = useState(false)

  const [feedMode, setFeedMode] = useState<"discover" | "following">("discover")

  const current = {
    posts: feedMode === "discover" ? discoverPosts : followingPosts,
    setPosts: feedMode === "discover" ? setDiscoverPosts : setFollowingPosts,
    hasMore: feedMode === "discover" ? discoverHasMore : followingHasMore,
    setHasMore:
      feedMode === "discover" ? setDiscoverHasMore : setFollowingHasMore,
    loading: feedMode === "discover" ? discoverLoading : followingLoading,
    setLoading:
      feedMode === "discover" ? setDiscoverLoading : setFollowingLoading,
  }

  async function loadMore() {
    const currentCopy = { ...current }
    const currentFeedMode = feedMode
    if (currentCopy.hasMore && !currentCopy.loading) {
      const cursor = currentCopy.posts.at(-1)?.id
      current.setLoading(true)
      const { posts: newPosts, hasMorePosts } = await fetchPosts({
        cursor,
        fromFollowing: currentFeedMode === "following",
      })
      current.setPosts((prevPosts) => [...prevPosts, ...newPosts])
      current.setHasMore(hasMorePosts)
      current.setLoading(false)
    }
  }

  function likePost(
    postId: string,
    newLikes?: Prisma.LikeGetPayload<{ select: { userId: true; id: true } }>[]
  ) {
    setDiscoverPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes:
                newLikes || !!post.likes.find((like) => like.userId === userId)
                  ? post.likes.filter((like) => like.userId !== userId)
                  : [...post.likes, { id: uuidv4(), userId: userId as string }],
            }
          : post
      )
    )
    setFollowingPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes:
                newLikes || post.likes.find((like) => like.userId === userId)
                  ? post.likes.filter((like) => like.userId !== userId)
                  : [...post.likes, { id: uuidv4(), userId: userId as string }],
            }
          : post
      )
    )
  }

  function commentPost(
    postId: string,
    newComments?: Prisma.CommentGetPayload<{
      select: { id: true }
    }>[]
  ) {
    setDiscoverPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: newComments || [...post.comments, { id: uuidv4() }],
            }
          : post
      )
    )
    setFollowingPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: newComments || [...post.comments, { id: uuidv4() }],
            }
          : post
      )
    )
  }

  function addPost(newPost: PostWithRelations) {
    setDiscoverPosts((prevPosts) => [newPost, ...prevPosts])
    setFollowingPosts((prevPosts) => [newPost, ...prevPosts])
  }

  useEffect(() => {
    async function loadInitial() {
      setDiscoverLoading(true)
      const { posts: initialPosts, hasMorePosts } = await fetchPosts({})
      setDiscoverPosts(initialPosts)
      setDiscoverHasMore(hasMorePosts)
      setDiscoverLoading(false)
    }
    loadInitial()
  }, [])

  return (
    <HomePostsContext.Provider
      value={{
        posts: current.posts,
        hasMore: current.hasMore,
        loading: current.loading,
        loadMore,
        likePost,
        commentPost,
        addPost,
        feedMode,
        setFeedMode,
      }}
    >
      {children}
    </HomePostsContext.Provider>
  )
}

export function useHomePosts() {
  return useContext(HomePostsContext)
}
