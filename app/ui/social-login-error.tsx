"use client"

import { useSearchParams } from "next/navigation"

export default function SocialLoginError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  if (error === "OAuthAccountNotLinked") {
    return (
      <p className="text-danger">Another account is linked with this email</p>
    )
  }

  return null
}
