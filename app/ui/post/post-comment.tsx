import CommentForm from "../comment-form"
import CommentList from "../comment-list"

export default function PostComment({ postId, comments }) {
  return (
    <div className="p-4">
      <div className="w-full h-[1px] bg-gray-200"></div>
      <CommentForm postId={postId} />
      <CommentList comments={comments} />
    </div>
  )
}
