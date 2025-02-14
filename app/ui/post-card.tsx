export default function PostCard({ post }) {
  return (
    <article className="p-4 border-b border-gray-200 space-y-2">
      <p>{post.content}</p>
    </article>
  )
}
