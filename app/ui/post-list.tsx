import { fetchPosts, fetchUserPosts } from "../lib/data"
import PostCard from "./post-card"

export default async function PostList({ userId }: { userId?: string }) {
  const posts = userId ? await fetchUserPosts(userId) : await fetchPosts()

  return posts.map((post) => <PostCard key={post.id} post={post} />)
}
