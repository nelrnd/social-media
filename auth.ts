import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Nodemailer from "next-auth/providers/nodemailer"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/app/lib/prisma"
import { Profile } from "@prisma/client"
import { randomInt } from "crypto"
import { createTransport } from "nodemailer"

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
      async generateVerificationToken() {
        return generateOTP().toString()
      },
      maxAge: 3 * 60, // 3 minutes
      async sendVerificationRequest({
        identifier: email,
        token,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url)
        const transport = createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `AHSI confirmation code: ${token}`,
          text: text({ token, host }),
          html: html({ token, host }),
        })
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
        const profile = await getProfile(session.user.id)
        token.profile = profile
      }

      session.user.profile = token.profile as Profile | null

      return session
    },
  },
})

function generateOTP() {
  return randomInt(100000, 999999)
}

function html(params: { token: string; host: string }) {
  const { token, host } = params
  const escapedHost = host.replace(/\\./g, "&#8203;.")

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to AHSI
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center"><strong>Sign in code:</strong> ${token}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Keep in mind that this code will expire after <strong><em>3 minutes</em></strong>. If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
  `
}

function text(params: { token: string; host: string }) {
  return `
  Sign in to ${params.host}

  Sign in code: ${params.token}

  Keep in mind that this code will expire after 3 minutes. If you did not request this email you can safely ignore it.
  `
}
