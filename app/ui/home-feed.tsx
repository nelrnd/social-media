import { fetchFollowingPosts } from "../lib/data"
import Post from "./post"

export default async function HomeFeed() {
  const posts = await fetchFollowingPosts()

  return posts.map((post) => <Post key={post.id} post={post} />)
}
