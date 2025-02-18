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
      <header>{comment.user.profile?.username}</header>
      <section>{comment.content}</section>
    </div>
  )
}
