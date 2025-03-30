import { fetchProfiles } from "../lib/data"
import ProfileCard from "./profile-card"

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
