import PostForm from "../ui/post-form"
import PostList from "../ui/post-list"

const posts = [
  {
    id: 1,
    content: "Hello World!",
  },
  {
    id: 2,
    content: "TESTING",
  },
  {
    id: 3,
    content: "ABCDEF",
  },
]

export default function Home() {
  return (
    <main>
      <PostForm />
      <PostList posts={posts} />
    </main>
  )
}
