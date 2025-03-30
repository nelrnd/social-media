"use client"

import { useEffect, useState } from "react"
import { fetchPosts } from "../lib/data"
import { useInView } from "react-intersection-observer"
import Post, { PostSkeleton } from "./post"
import { PostWithRelations } from "../lib/definitions"
import PostForm from "./post-form"
import { usePostForm } from "../providers/post-form-provider"
import TabSwitcher from "./tab-switcher"

export default function Feed({
  initialPosts,
  initialHasMorePosts,
  userId,
  withForm = false,
}: {
  initialPosts: PostWithRelations[]
  initialHasMorePosts: boolean
  userId?: string
  withForm?: boolean
}) {
  const [bottom, bottomInView] = useInView()
  const [form, formInView] = useInView({
    threshold: 0.3,
    initialInView: withForm,
  })
  const [posts, setPosts] = useState(initialPosts)
  const [hasMorePosts, setHasMorePosts] = useState(initialHasMorePosts)
  const [isLoading, setIsLoading] = useState(bottomInView && hasMorePosts)
  const { setVisible } = usePostForm()

  function addPost(post: PostWithRelations) {
    setPosts((prevPosts) => [post, ...prevPosts])
  }

  useEffect(() => {
    let ignore = false
    if (bottomInView && hasMorePosts) {
      ;(async () => {
        const cursor = posts.at(-1)?.id
        setIsLoading(true)
        const { posts: newPosts, hasMorePosts } = await fetchPosts({
          cursor,
          userId,
        })
        if (!ignore) {
          setPosts((prevPosts) => [...prevPosts, ...newPosts])
          setHasMorePosts(hasMorePosts)
          setIsLoading(false)
        }
      })()
    }
    return () => {
      ignore = true
    }
  }, [bottomInView, hasMorePosts, posts, userId])

  useEffect(() => {
    setVisible(!formInView)
  }, [formInView, setVisible])

  return (
    <div>
      {withForm && (
        <div className="p-6 border-b border-border" ref={form}>
          <PostForm handleAdd={addPost} />
        </div>
      )}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <div ref={bottom} className="h-[1px]" />
      {isLoading &&
        [...Array(3).keys()].map((item) => <PostSkeleton key={item} />)}
      {!hasMorePosts && (
        <div className="p-6 border-b border-border text-center text-soft">
          {posts.length ? "No more posts" : "No posts for now"}
        </div>
      )}
    </div>
  )
}

export function FeedSkeleton({ size }: { size: number }) {
  return (
    <div>
      {[...Array(size).keys()].map((item) => (
        <PostSkeleton key={item} />
      ))}
    </div>
  )
}
