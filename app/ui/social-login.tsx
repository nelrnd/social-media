"use client"

import { JSX, Suspense } from "react"
import SocialLoginError from "./social-login-error"
import { Button } from "./buttons"
import { signInWithGithub, signInWithGoogle } from "../lib/actions"
import { useSearchParams } from "next/navigation"

export default function SocialLogin() {
  const searchParams = useSearchParams()
  const callbackUrl =
    searchParams.get("callbackUrl") || new URL(document.URL).origin + "/"

  return (
    <div className="space-y-3">
      <div className="relative select-none mb-6">
        <div className="text-soft w-fit bg-background px-4 m-auto relative z-10">
          or
        </div>
        <div className="h-[1px] w-full bg-border absolute top-1/2"></div>
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button type="submit" variant="secondary" className="w-full">
          <GoogleIcon />
          Sign in with Google
        </Button>
      </form>

      <form action={signInWithGithub}>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button type="submit" variant="secondary" className="w-full">
          <GithubIcon />
          Sign in with GitHub
        </Button>
      </form>

      <Suspense>
        <SocialLoginError />
      </Suspense>
    </div>
  )
}

// https://feathericons.dev/?search=google&iconset=brands&format=strict-tsx
function GoogleIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      {...props}
    >
      <path
        d="M24 12.276c0-.816-.067-1.636-.211-2.438H12.242v4.62h6.612a5.549 5.549 0 0 1-2.447 3.647v2.998h3.945C22.669 19.013 24 15.927 24 12.276Z"
        fill="#4285F4"
      />
      <path
        d="M12.241 24c3.302 0 6.086-1.063 8.115-2.897l-3.945-2.998c-1.097.732-2.514 1.146-4.165 1.146-3.194 0-5.902-2.112-6.873-4.951H1.302v3.09C3.38 21.444 7.612 24 12.242 24Z"
        fill="#34A853"
      />
      <path
        d="M5.369 14.3a7.053 7.053 0 0 1 0-4.595v-3.09H1.302a11.798 11.798 0 0 0 0 10.776L5.369 14.3Z"
        fill="#FBBC04"
      />
      <path
        d="M12.241 4.75a6.727 6.727 0 0 1 4.696 1.798l3.495-3.425A11.898 11.898 0 0 0 12.243 0C7.611 0 3.38 2.558 1.301 6.615l4.067 3.09C6.336 6.862 9.048 4.75 12.24 4.75Z"
        fill="#EA4335"
      />
    </svg>
  )
}

// https://feathericons.dev/?search=github&iconset=brands&format=strict-tsx
function GithubIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      {...props}
    >
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        className="fill-[#333] dark:fill-white"
      />
    </svg>
  )
}
