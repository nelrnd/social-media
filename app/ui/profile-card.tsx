import { Profile } from "@prisma/client"
import Link from "next/link"

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.username}`}
      className="block p-4 hover:bg-gray-50 hover:underline transition-colors"
    >
      <span className="font-bold">{profile.name}</span>{" "}
      <span className="text-gray-600">{profile.username}</span>
    </Link>
  )
}
