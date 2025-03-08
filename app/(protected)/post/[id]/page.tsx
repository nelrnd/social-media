import { fetchPostById } from "@/app/lib/data"
import PageHeader from "@/app/ui/page-header"
import Post from "@/app/ui/post/post"

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const post = await fetchPostById(id)

  if (!post) return null

  return (
    <main>
      <PageHeader title="Post" allowBack={true} />
      <Post post={post} />
    </main>
  )
}
