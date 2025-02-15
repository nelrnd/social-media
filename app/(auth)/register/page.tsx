import Link from "next/link"
import RegisterForm from "@/app/ui/register-form"
import SocialLogin from "@/app/ui/social-login"

export default function RegisterPage() {
  return (
    <main>
      <div className="max-w-[50rem] m-auto p-4">
        <RegisterForm />
        <SocialLogin />
        <p>
          You already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
