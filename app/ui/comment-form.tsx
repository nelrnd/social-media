export default function CommentForm() {
  return (
    <form>
      <textarea
        name="content"
        id="content"
        placeholder="Type in your comment"
      ></textarea>
      <button>Reply</button>
    </form>
  )
}
