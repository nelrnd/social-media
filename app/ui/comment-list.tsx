import { fetchComments } from "../lib/data"
import Comment from "./comment"

export default async function CommentList({ postId }: { postId: string }) {
  const comments = await fetchComments(postId)

  return comments.map((comment) => (
    <Comment key={comment.id} comment={comment} />
  ))
}
