import { fetchIsFollowing, fetchPosts, fetchProfile } from "@/app/lib/data"
import Feed from "@/app/ui/feed"
import ProfileHeader from "@/app/ui/profile-header"
import { auth } from "@/auth"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const username = (await params).username

  const [session, profile] = await Promise.all([auth(), fetchProfile(username)])

  if (!profile) {
    return <p>Profile not found</p>
  }

  const authUserId = session?.user.id || ""
  const isFollowing = await fetchIsFollowing(profile.id)
  const { posts: initialPosts, hasMorePosts } = await fetchPosts({
    userId: profile.userId,
  })

  return (
    <main>
      <ProfileHeader
        profile={profile}
        authUserId={authUserId}
        isFollowing={isFollowing}
      />

      <Feed
        userId={profile.userId}
        initialPosts={initialPosts}
        initialHasMorePosts={hasMorePosts}
      />
    </main>
  )
}
