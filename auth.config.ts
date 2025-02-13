import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      if (isLoggedIn) console.log("logged in")
      const isOnProtectedRoute = !["/login", "/register"].includes(
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
  providers: [],
} satisfies NextAuthConfig
