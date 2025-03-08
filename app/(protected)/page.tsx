import HomeFeed from "../ui/home-feed"
import PageHeader from "../ui/page-header"
import PostForm from "../ui/post/post-form"
import PostList from "../ui/post/post-list"

export default function Home() {
  return (
    <main>
      <PageHeader title="Home" />
      <PostForm />
      <HomeFeed />
    </main>
  )
}
