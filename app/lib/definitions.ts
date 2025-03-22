import { Prisma } from "@prisma/client"

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    user: { select: { profile: true } }
    likes: { select: { id: true; userId: true } }
    comments: { select: { id: true } }
  }
}>
