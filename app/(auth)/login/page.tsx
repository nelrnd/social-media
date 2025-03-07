import Link from "next/link"
import LoginForm from "@/app/ui/login-form"
import SocialLogin from "@/app/ui/social-login"

export default function LoginPage() {
  return (
    <main>
      <div className="max-w-[50rem] m-auto p-4 space-y-6">
        <LoginForm />
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
