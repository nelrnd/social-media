"use client"

import { Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { fetchFollowingPosts, fetchPosts } from "../lib/data"
import Post from "./post"

export default function Feed() {
  const [feedType, setFeedType] = useState("discover")
  const [posts, setPosts] = useState<
    Prisma.PostGetPayload<{
      include: {
        user: { select: { profile: true } }
        likes: { select: { id: true; userId: true } }
        comments: { select: { id: true } }
      }
    }>[]
  >()

  function changeFeedType(e: React.ChangeEvent<HTMLInputElement>) {
    setFeedType(e.target.value)
  }

  useEffect(() => {
    async function fetch() {
      let posts
      switch (feedType) {
        case "discover":
          posts = await fetchPosts()
          setPosts(posts)
          break
        case "following":
          posts = await fetchFollowingPosts()
          setPosts(posts)
        default:
          break
      }
    }
    fetch()
  }, [feedType])

  return (
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

      {posts?.map((post) => <Post key={post.id} initialPost={post} />)}
    </div>
  )
}
