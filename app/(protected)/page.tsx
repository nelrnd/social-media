import PageHeader from "../ui/page-header"
import PostForm from "../ui/post-form"
import PostList from "../ui/post-list"

export default function Home() {
  return (
    <main>
      <PageHeader title="Home" />
      <PostForm />
      <PostList />
    </main>
  )
}
