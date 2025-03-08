import { Prisma } from "@prisma/client"
import Comment from "./comment"

export default async function CommentList({
  comments,
}: {
  comments: Prisma.CommentGetPayload<{
    include: { user: { select: { profile: true } } }
  }>[]
}) {
  return (
    <div className="p-4">
      <h2 className="font-bold">Comments</h2>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
