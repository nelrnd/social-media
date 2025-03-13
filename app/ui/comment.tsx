import { Prisma } from "@prisma/client"
import moment from "moment"
import Link from "next/link"

export default function Comment({
  comment,
}: {
  comment: Prisma.CommentGetPayload<{
    include: { user: { select: { profile: true } } }
  }>
}) {
  return (
    <div className="p-2 border-b border-gray-200 first:border-t">
      <header className="flex items-center justify-between">
        <p className="relative z-10 w-fit">
          <Link
            href={`/profile/${comment.user.profile?.username}`}
            className="hover:underline"
          >
            <span className="font-bold">{comment.user.profile?.name}</span>{" "}
            <span className="text-gray-600">
              {comment.user.profile?.username}
            </span>
          </Link>
        </p>
        <time className="text-gray-600 text-sm">
          {moment(comment.createdAt).format("LT")}
        </time>
      </header>

      <section>
        <p>{comment.content}</p>
      </section>
    </div>
  )
}
