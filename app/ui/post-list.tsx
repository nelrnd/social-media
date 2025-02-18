import { fetchPosts, fetchUserPosts } from "../lib/data"
import Post from "./post"

export default async function PostList({ userId }: { userId?: string }) {
  const posts = userId ? await fetchUserPosts(userId) : await fetchPosts()

  return posts.map((post) => <Post key={post.id} post={post} />)
}
