import NextAuth from "next-auth"
import { Prisma, User } from "@prisma/client"
import { AdapterUser } from "next-auth/adapters"

type UserWithProfile = Prisma.UserGetPayload<{ include: { profile: true } }>

declare module "next-auth" {
  interface User extends DefaultUser {
    profile?: UserWithProfile["profile"]
  }

  interface Session extends DefaultSession {
    user: User
  }
}
