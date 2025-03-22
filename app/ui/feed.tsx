"use client"

import { Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { fetchPosts } from "../lib/data"
import { useInView } from "react-intersection-observer"
import Post from "./post"

export default function Feed({
  initialPosts,
  initialHasMorePosts,
}: {
  initialPosts: Prisma.PostGetPayload<{
    include: {
      user: { select: { profile: true } }
      likes: { select: { id: true; userId: true } }
      comments: { select: { id: true } }
    }
  }>[]
  initialHasMorePosts: boolean
}) {
  const { ref, inView } = useInView()
  const [posts, setPosts] = useState(initialPosts)
  const [hasMorePosts, setHasMorePosts] = useState(initialHasMorePosts)
  const [isLoading, setIsLoading] = useState(inView && hasMorePosts)

  useEffect(() => {
    let ignore = false
    if (inView && hasMorePosts) {
      ;(async () => {
        const cursor = posts.at(-1)?.id
        if (cursor) {
          setIsLoading(true)
          const { posts: newPosts, hasMorePosts } = await fetchPosts(cursor)
          if (!ignore) {
            setPosts((prevPosts) => [...prevPosts, ...newPosts])
            setHasMorePosts(hasMorePosts)
            setIsLoading(false)
          }
        }
      })()
    }
    return () => {
      ignore = true
    }
  }, [inView])

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isLoading && <p className="text-4xl">LOADING!</p>}
      <div ref={ref} className="h-[1px]" />
    </div>
  )
}

/*
TAB SWITCHER
<div>
  <div className="p-1 bg-gray-100 grid grid-cols-2 border-b boder-gray-200 gap-2">
    <label htmlFor="discover">
      <input
        type="radio"
        id="discover"
        name="feedType"
        value="discover"
        className="hidden peer"
        onChange={changeFeedType}
        checked={feedType === "discover"}
      />
      <div className="p-4 text-center cursor-pointer rounded-sm peer-checked:bg-white transition-colors">
        Discover
      </div>
    </label>
    <label htmlFor="following">
      <input
        type="radio"
        id="following"
        name="feedType"
        value="following"
        className="hidden peer"
        onChange={changeFeedType}
        checked={feedType === "following"}
      />
      <div className="p-4 text-center cursor-pointer rounded-sm peer-checked:bg-white transition-colors">
        Following
      </div>
    </label>
  </div>
*/
