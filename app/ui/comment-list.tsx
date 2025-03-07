import { Prisma } from "@prisma/client"
import Comment from "./comment"

export default async function CommentList({
  comments,
}: {
  comments: Prisma.CommentGetPayload<{
    include: { user: { select: { profile: true } } }
  }>[]
}) {
  return comments.map((comment) => (
    <Comment key={comment.id} comment={comment} />
  ))
}
