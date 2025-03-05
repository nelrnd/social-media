"use client"

import { followProfile } from "../lib/actions"

export default function FollowButton({
  profileId,
  isFollowing,
}: {
  profileId: string
  isFollowing: boolean
}) {
  return isFollowing ? (
    <button
      onClick={() => followProfile(profileId)}
      className="block w-fit ml-auto py-2 px-6 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
    >
      Unfollow
    </button>
  ) : (
    <button
      onClick={() => followProfile(profileId)}
      className="block w-fit ml-auto py-2 px-6 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity"
    >
      Follow
    </button>
  )
}
