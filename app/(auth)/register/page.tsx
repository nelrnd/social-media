import Link from "next/link"
import RegisterForm from "@/app/ui/register-form"
import SocialLogin from "@/app/ui/social-login"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
}

export default function RegisterPage() {
  return (
    <main>
      <div className="max-w-[32rem] m-auto p-4 pt-6 space-y-6">
        <RegisterForm />
        <SocialLogin />
        <p>
          You already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
