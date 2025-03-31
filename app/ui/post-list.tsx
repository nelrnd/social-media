"use client"

import { useInView } from "react-intersection-observer"
import { useHomePosts } from "../providers/home-posts-provider"
import Post, { PostSkeleton } from "./post"
import { useEffect } from "react"
import TabSwitcher from "./feed-mode-switcher"

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

export function PostListSkeleton({ size = 6 }: { size?: number }) {
  return (
    <div>
      {[...Array(size).keys()].map((item) => (
        <PostSkeleton key={item} />
      ))}
    </div>
  )
}
