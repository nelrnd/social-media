import Comment from "./comment"

export default function CommentList({ postId }: { postId: string }) {
  const comments = [{ id: "a", content: "Hey?" }]

  return comments.map((comment) => (
    <Comment key={comment.id} comment={comment} />
  ))
}
