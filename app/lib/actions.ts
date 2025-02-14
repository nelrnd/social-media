"use server"

import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials"
        default:
          return "Something went wrong"
      }
    }
    throw error
  }
}

const RegisterFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function register(
  prevState: string | undefined,
  formData: FormData
) {
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 12)
  try {
    await prisma.user.create({ data: { email, password: hashedPassword } })
    await signIn("credentials", formData)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function createPost(prevState, formData: FormData) {
  console.log(formData.get("content"))
  const session = await auth()
  console.log(session?.user)
}
