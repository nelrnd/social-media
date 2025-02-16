export default function PostCard({ post }) {
  return (
    <article className="p-4 border-b border-gray-200 space-y-2">
      <header>
        <p>
          <span className="font-bold">{post.user.profile.name}</span>{" "}
          {post.user.profile.username}
        </p>
      </header>
      <p>{post.content}</p>
    </article>
  )
}
