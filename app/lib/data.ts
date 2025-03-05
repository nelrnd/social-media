"use server"

import { auth } from "@/auth"
import { prisma } from "./prisma"

export async function fetchPosts() {
  const posts = await prisma.post.findMany({
    include: { user: { select: { profile: true } }, likes: true },
    orderBy: { createdAt: "desc" },
  })
  return posts
}

export async function fetchProfile(username: string) {
  const profile = await prisma.profile.findUnique({ where: { username } })
  return profile
}

export async function fetchUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: { user: { select: { profile: true } }, likes: true },
    orderBy: { createdAt: "desc" },
  })
  return posts
}

export async function fetchComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: { select: { profile: true } } },
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

export async function fetchIsFollowing(userId: string) {
  const session = await auth()
  const follow = await prisma.follow.findFirst({
    where: { followingId: userId, followerId: session?.user?.id },
  })
  return !!follow
}
