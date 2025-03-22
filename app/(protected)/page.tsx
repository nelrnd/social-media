import { fetchPosts } from "../lib/data"
import Feed from "../ui/feed"
import PageHeader from "../ui/page-header"

export default async function HomePage() {
  const { posts: initialPosts, hasMorePosts } = await fetchPosts()

  return (
    <main>
      <PageHeader title="Home" />
      <Feed
        withForm={true}
        initialPosts={initialPosts}
        initialHasMorePosts={hasMorePosts}
      />
    </main>
  )
}
