import { Prisma } from "@prisma/client"

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        profile: {
          include: {
            followers: { select: { id: true } }
            following: { select: { id: true } }
          }
        }
      }
    }
    likes: { select: { id: true; userId: true } }
    comments: { select: { id: true } }
  }
}>

export type PostId = Prisma.PostGetPayload<{ select: { id: true } }>["id"]

export type CommentWithRelations = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        profile: {
          include: {
            followers: { select: { id: true } }
            following: { select: { id: true } }
          }
        }
      }
    }
    likes: { select: { id: true; userId: true } }
  }
}>

export type ProfileWithRelations = Prisma.ProfileGetPayload<{
  include: {
    followers: {
      select: {
        id: true
      }
    }
    following: {
      select: {
        id: true
      }
    }
  }
}>

export type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    from: {
      select: {
        profile: {
          include: {
            followers: {
              select: {
                id: true
              }
            }
            following: {
              select: {
                id: true
              }
            }
          }
        }
      }
    }
    post: { include: { user: { select: { profile: true } } } }
    comment: { include: { user: { select: { profile: true } } } }
  }
}>
