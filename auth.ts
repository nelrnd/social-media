import NextAuth, { Session } from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { z } from "zod"
import bcrypt from "bcrypt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/app/lib/prisma"
import { Profile } from "@prisma/client"

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user")
  }
}

async function getProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId } })
    return profile
  } catch (error) {
    console.error("Failed to fetch profile", error)
    throw new Error("Failed to fetch profile")
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) return null
          const passwordsMatch = await bcrypt.compare(
            password,
            user.password || ""
          )
          if (passwordsMatch) return user
        }

        console.log("Invalid credentials")
        return null
      },
    }),
    Google,
    GitHub,
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.profile = user.profile
      }
      return token
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
        if (!token.profile) {
          const profile = await getProfile(session.user.id)
          token.profile = profile
        }
      }

      session.user.profile = token.profile as Profile | null

      return session
    },
  },
})
