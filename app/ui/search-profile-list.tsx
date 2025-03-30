import { fetchProfiles } from "../lib/data"
import ProfileCard, { ProfileCardSkeleton } from "./profile-card"

export default async function SearchProfileList({ query }: { query: string }) {
  const profiles = await fetchProfiles(query)

  return (
    <div>
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
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
