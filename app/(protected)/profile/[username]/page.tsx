import { fetchProfile, fetchUserPosts } from "@/app/lib/data"
import PostList from "@/app/ui/post/post-list"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const username = (await params).username
  const profile = await fetchProfile(username)

  return (
    <main>
      <header className="p-4 space-y-4 border-b border-gray-200">
        <div className="grid grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl font-bold">{profile?.name}</h1>
            <p className="text-gray-600">{profile?.username}</p>
          </div>
          <button className="block w-fit ml-auto py-2 px-6 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity">
            Follow
          </button>
        </div>
        <p>{profile?.bio}</p>
      </header>
      <section>
        <PostList userId={profile?.userId} />
      </section>
    </main>
  )
}
