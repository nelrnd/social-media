import { fetchComments } from "../lib/data"
import Comment from "./comment"

export default async function CommentList({ comments }) {
  return comments.map((comment) => (
    <Comment key={comment.id} comment={comment} />
  ))
}
