import { Prisma } from "@prisma/client"
import Link from "next/link"
import Date from "./date"
import Avatar from "./avatar"

export default function Comment({
  comment,
}: {
  comment: Prisma.CommentGetPayload<{
    include: { user: { select: { profile: true } } }
  }>
}) {
  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0 grid grid-cols-[auto_1fr] gap-4">
      <Link
        href={`/profile/${comment.user.profile?.username}`}
        className="w-fit h-fit rounded-full hover:brightness-90 transition-all"
      >
        <Avatar src={comment.user.profile?.imageUrl} size="sm" />
      </Link>
      <div>
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
          <Date date={comment.createdAt} />
        </header>

        <section>
          <p>{comment.content}</p>
        </section>
      </div>
    </div>
  )
}
