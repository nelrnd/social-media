import NextAuth, { Session } from "next-auth"
import { authConfig } from "./auth.config"
import Nodemailer from "next-auth/providers/nodemailer"
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
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
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
        const profile = await getProfile(session.user.id)
        token.profile = profile
      }

      session.user.profile = token.profile as Profile | null

      return session
    },
  },
})
