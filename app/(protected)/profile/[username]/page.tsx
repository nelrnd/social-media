import { fetchIsFollowing, fetchProfile } from "@/app/lib/data"
import FollowBar from "@/app/ui/follow-bar"
import FollowButton from "@/app/ui/follow-button"
import PostList from "@/app/ui/post/post-list"
import { auth } from "@/auth"
import Link from "next/link"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const username = (await params).username
  const profile = await fetchProfile(username)
  const session = await auth()
  const sameUser = session?.user?.id === profile?.userId
  const isFollowing = await fetchIsFollowing(profile?.id || "") // to be modified

  return (
    <main>
      <header className="p-4 space-y-4 border-b border-gray-200">
        <div className="grid grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl font-bold">{profile?.name}</h1>
            <p className="text-gray-600">{profile?.username}</p>
          </div>
          {sameUser ? (
            <Link
              href="/settings/profile"
              className="block w-fit ml-auto py-2 px-6 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Edit
            </Link>
          ) : (
            <FollowButton
              isFollowing={isFollowing}
              profileId={profile?.id || "" /* to be modified */}
            />
          )}
        </div>
        <p>{profile?.bio}</p>
        <FollowBar profile={profile} />
      </header>
      <section>
        <PostList userId={profile?.userId} />
      </section>
    </main>
  )
}
