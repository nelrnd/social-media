import Link from "next/link"
import RegisterForm from "../ui/register-form"

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
      <p>
        You already have an account? <Link href="/login">Login</Link>
      </p>
    </main>
  )
}
