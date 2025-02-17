"use server"

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
