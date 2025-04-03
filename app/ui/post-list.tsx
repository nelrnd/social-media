"use client"

import { useInView } from "react-intersection-observer"
import { useHomePosts } from "../providers/home-posts-provider"
import Post, { PostSkeleton } from "./post"
import { useEffect, useState } from "react"
import TabSwitcher from "./feed-mode-switcher"
import { PostWithRelations } from "../lib/definitions"
import { fetchPosts } from "../lib/data"
import { usePostForm } from "../providers/post-form-provider"
import { useSession } from "next-auth/react"

export function HomePostList() {
  const { posts, hasMore, loading, loadMore } = useHomePosts()
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <div>
      <TabSwitcher />
      {posts.slice(0, -1).map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <div ref={ref} className="h-px"></div>
      {posts.slice(-1).map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <PostListSkeleton />}
      {!hasMore && (
        <div className="p-6 border-b border-border text-center text-soft">
          {posts.length ? "No more posts" : "No posts for now"}
        </div>
      )}
    </div>
  )
}

export function ProfilePostList({
  initialPosts,
  initialHasMorePosts,
  userId,
}: {
  initialPosts: PostWithRelations[]
  initialHasMorePosts: boolean
  userId?: string
}) {
  const session = useSession()
  const authUserId = session.data?.user.id
  const [posts, setPosts] = useState(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMorePosts)
  const { ref, inView } = useInView()
  const [isLoading, setIsLoading] = useState(inView && hasMore)

  const { addCb } = usePostForm()

  function addPost(newPost: PostWithRelations) {
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  useEffect(() => {
    let ignore = false
    if (inView && hasMore) {
      async function loadMore() {
        const cursor = posts.at(-1)?.id
        setIsLoading(true)
        const { posts: newPosts, hasMorePosts } = await fetchPosts({
          cursor,
          userId,
        })
        if (!ignore) {
          setPosts((prevPosts) => [...prevPosts, ...newPosts])
          setHasMore(hasMorePosts)
          setIsLoading(false)
        }
      }
      loadMore()
    }
    return () => {
      ignore = true
    }
  }, [inView, hasMore, posts, userId])

  useEffect(() => {
    if (userId === authUserId) {
      addCb.current = addPost
    } else {
      addCb.current = null
    }
  }, [userId, authUserId])

  return (
    <div>
      {posts.slice(0, -1).map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <div ref={ref} className="h-px"></div>
      {posts.slice(-1).map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isLoading && <PostListSkeleton />}
      {!hasMore && (
        <div className="p-6 border-b border-border text-center text-soft">
          {posts.length ? "No more posts" : "No posts for now"}
        </div>
      )}
    </div>
  )
}

export function PostListSkeleton({ size = 6 }: { size?: number }) {
  return (
    <div>
      {[...Array(size).keys()].map((item) => (
        <PostSkeleton key={item} />
      ))}
    </div>
  )
}
