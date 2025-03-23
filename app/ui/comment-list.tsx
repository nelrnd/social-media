import Comment from "./comment"
import { CommentWithRelations } from "../lib/definitions"

export default async function CommentList({
  comments,
}: {
  comments: CommentWithRelations[]
}) {
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
