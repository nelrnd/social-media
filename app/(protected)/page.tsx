import Feed from "../ui/feed"
import PageHeader from "../ui/page-header"
import PostForm from "../ui/post-form"
import PostList from "../ui/post-list"

export default function Home() {
  return (
    <main>
      <PageHeader title="Home" />
      <PostForm />
      <Feed />
      <PostList />
    </main>
  )
}
