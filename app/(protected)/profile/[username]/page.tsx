import { fetchIsFollowing, fetchPosts, fetchProfile } from "@/app/lib/data"
import NotFound from "@/app/ui/not-found"
import PageHeader from "@/app/ui/page-header"
import { ProfilePostList } from "@/app/ui/post-list"
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
    return <NotFound>Could not find this profile</NotFound>
  }

  const authUserId = session?.user.id || ""
  const isFollowing = await fetchIsFollowing(profile.id)
  const { posts: initialPosts, hasMorePosts } = await fetchPosts({
    userId: profile.userId,
  })

  return (
    <main>
      <PageHeader title={profile.name} allowBack={true} />
      <ProfileHeader
        profile={profile}
        authUserId={authUserId}
        isFollowing={isFollowing}
      />
      <ProfilePostList
        userId={profile.userId}
        initialPosts={initialPosts}
        initialHasMorePosts={hasMorePosts}
      />
    </main>
  )
}
