import { fetchPosts } from "../lib/data"
import Feed from "../ui/feed"
import PageHeader from "../ui/page-header"
import PostForm from "../ui/post-form"

export default async function HomePage() {
  const { posts: initialPosts, hasMorePosts } = await fetchPosts()

  return (
    <main>
      <PageHeader title="Home" />
      <PostForm />
      <Feed initialPosts={initialPosts} initialHasMorePosts={hasMorePosts} />
    </main>
  )
}
