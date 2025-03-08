import { fetchPostById } from "@/app/lib/data"

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const post = await fetchPostById(id)

  return <main>{post.content}</main>
}
