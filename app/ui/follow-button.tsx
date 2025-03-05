"use client"

import { followUser } from "../lib/actions"

export default function FollowButton({
  userId,
  isFollowing,
}: {
  userId: string
  isFollowing: boolean
}) {
  return isFollowing ? (
    <button
      onClick={() => followUser(userId)}
      className="block w-fit ml-auto py-2 px-6 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
    >
      Unfollow
    </button>
  ) : (
    <button
      onClick={() => followUser(userId)}
      className="block w-fit ml-auto py-2 px-6 bg-gray-900 text-white disabled:opacity-50 hover:opacity-95 transition-opacity"
    >
      Follow
    </button>
  )
}
