import Link from "next/link"
import LoginForm from "@/app/ui/login-form"
import SocialLogin from "@/app/ui/social-login"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <main>
      <div className="max-w-[32rem] m-auto p-4 pt-6 space-y-6">
        <Suspense>
          <LoginForm />
        </Suspense>
        <SocialLogin />
        <p>
          You don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}
