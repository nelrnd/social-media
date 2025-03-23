"use server"

import { auth } from "@/auth"
import { prisma } from "./prisma"
import { Prisma } from "@prisma/client"

const ITEMS_PER_FETCH = 8

export async function getUserData() {
  const session = await auth()
  const userId = session?.user.id
  const profileId = session?.user.profile?.id
  if (!userId || !profileId) {
    throw new Error("User must be logged in")
  }
  return { userId, profileId }
}

export async function fetchPosts({
  cursor,
  userId,
}: {
  cursor?: string
  userId?: string
}) {
  const options: Prisma.PostFindManyArgs = {
    take: ITEMS_PER_FETCH,
    orderBy: { createdAt: "desc" },
  }
  if (cursor) {
    options.skip = 1
    options.cursor = { id: cursor }
  }
  if (userId) {
    options.where = { userId }
  }
  const posts = await prisma.post.findMany({
    ...options,
    include: {
      user: { select: { profile: true } },
      likes: { select: { id: true, userId: true } },
      comments: { select: { id: true } },
    },
  })
  let hasMorePosts
  if (posts.length < ITEMS_PER_FETCH) {
    hasMorePosts = false
  } else {
    const lastCursor = posts.at(-1)?.id as string
    const nextPost = await prisma.post.findFirst({
      ...options,
      take: 1,
      cursor: { id: lastCursor },
    })
    hasMorePosts = !!nextPost
  }
  return { posts, hasMorePosts }
}

export async function fetchFollowingPosts() {
  const session = await auth()
  const profileId = session?.user?.profile?.id
  const following = await prisma.follow.findMany({
    where: { followerId: profileId },
    select: { following: { select: { user: true } } },
  })
  const posts = await prisma.post.findMany({
    where: {
      userId: { in: following.map((follow) => follow.following.user.id) },
    },
    include: {
      user: { select: { profile: true } },
      likes: { select: { id: true, userId: true } },
      comments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return posts
}

export async function fetchPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { profile: true } },
      likes: { select: { id: true, userId: true } },
      comments: { select: { id: true } },
    },
  })
  return post
}

export async function fetchProfile(username: string) {
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { following: true, followers: true },
  })
  return profile
}

export async function fetchUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: {
      user: { select: { profile: true } },
      likes: { select: { id: true, userId: true } },
      comments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return posts
}

export async function fetchComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { profile: true } },
      likes: { select: { id: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return comments
}

export async function fetchLikes(postId: string) {
  const likes = await prisma.like.findMany({
    where: { postId },
    include: { user: { select: { profile: true } } },
    orderBy: { createdAt: "desc" },
  })
  return likes
}

export async function fetchIsFollowing(profileId: string) {
  const session = await auth()
  const follow = await prisma.follow.findFirst({
    where: { followingId: profileId, followerId: session?.user?.profile?.id },
  })
  return !!follow
}

export async function fetchFollowings(profileId: string) {
  const followings = await prisma.follow.findMany({
    where: { followerId: profileId },
    include: { following: true },
    orderBy: { createdAt: "desc" },
  })
  return followings
}

export async function fetchFollowers(profileId: string) {
  const followers = await prisma.follow.findMany({
    where: { followingId: profileId },
    include: { follower: true },
    orderBy: { createdAt: "desc" },
  })
  return followers
}

export async function fetchNotifications() {
  const session = await auth()
  const userId = session?.user?.id
  const notifications = await prisma.notification.findMany({
    where: { toId: userId },
    include: {
      from: { select: { profile: true } },
      post: { include: { user: { select: { profile: true } } } },
      comment: { include: { user: { select: { profile: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
  return notifications
}

export async function fetchUnreadNotificationsCount() {
  const session = await auth()
  const userId = session?.user?.id
  const notifications = await prisma.notification.findMany({
    where: { toId: userId, isRead: false },
    select: { id: true },
  })
  return notifications.length
}
