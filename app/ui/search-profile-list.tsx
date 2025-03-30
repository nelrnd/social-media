import { fetchProfiles } from "../lib/data"
import ProfileCard, { ProfileCardSkeleton } from "./profile-card"

export default async function SearchProfileList({ query }: { query: string }) {
  const profiles = await fetchProfiles(query)

  if (!query) {
    return <p className="text-center text-soft">Try searching for people</p>
  }

  return (
    <div>
      {profiles.length === 0 ? (
        <p className="text-center text-soft">No profile found</p>
      ) : (
        profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))
      )}
    </div>
  )
}

export function SearchProfileListSkeleton({ size = 6 }: { size?: number }) {
  return (
    <div>
      {[...Array(size).keys()].map((item) => (
        <ProfileCardSkeleton key={item} />
      ))}
    </div>
  )
}
