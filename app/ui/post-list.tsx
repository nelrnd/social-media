import { fetchPosts } from "../lib/data"
import PostCard from "./post-card"

export default async function PostList() {
  const posts = await fetchPosts()

  return posts.map((post) => <PostCard key={post.id} post={post} />)
}
