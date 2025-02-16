import { Post, Prisma } from "@prisma/client"
import moment from "moment"

export default function PostCard({
  post,
}: {
  post: Prisma.PostGetPayload<{
    include: { user: { select: { profile: true } } }
  }>
}) {
  return (
    <article className="p-4 border-b border-gray-200 space-y-2">
      <header className="flex items-center justify-between">
        <p>
          <span className="font-bold">{post.user.profile?.name}</span>{" "}
          <span className="text-gray-600">{post.user.profile?.username}</span>
        </p>
        <time className="text-gray-600 text-sm">
          {moment(post.createdAt).format("LT")}
        </time>
      </header>
      <p>{post.content}</p>
    </article>
  )
}
