import PostCard from "./post-card"

export default function PostList({ posts }) {
  return posts.map((post) => <PostCard key={post.id} post={post} />)
}
