"use server"

import { prisma } from "./prisma"

export async function fetchPosts() {
  const posts = await prisma.post.findMany({ include: { user: true } })
  return posts
}
