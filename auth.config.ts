import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/join",
    newUser: "/profile-setup",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnProtectedRoute = !["/join"].includes(
        nextUrl.pathname.split("?")[0]
      )
      if (isOnProtectedRoute) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl))
      }
      return true
    },
  },
} satisfies NextAuthConfig
