import { Prisma } from "@prisma/client"

export default function Comment({
  comment,
}: {
  comment: Prisma.CommentGetPayload<{
    include: { user: { select: { profile: true } } }
  }>
}) {
  return (
    <div>
      <span className="font-bold">{comment.user.profile?.username}</span>:{" "}
      {comment.content}
    </div>
  )
}
