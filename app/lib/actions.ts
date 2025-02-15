"use server"

import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export type AuthState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string | null
  data?: FormData
}

const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export async function authenticate(prevState: AuthState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: formData,
    }
  }

  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials", data: formData }
        default:
          return { message: "Something went wrong", data: formData }
      }
    }
    throw error
  }

  return { message: "Logged in with success" }
}

const RegisterFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email format is invalid")
    .refine(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } })
      return !user
    }, "Email is already used"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

export async function register(prevState: AuthState, formData: FormData) {
  const validatedFields = await RegisterFormSchema.safeParseAsync({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: formData,
    }
  }

  const { email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    await prisma.user.create({ data: { email, password: hashedPassword } })
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { message: "Something went wrong", data: formData }
    }
    console.error(error)
    throw error
  }

  return { message: "Registered with success" }
}

const PostFormSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty"),
})

export async function createPost(
  prevState: string | undefined,
  formData: FormData
) {
  const validatedFields = PostFormSchema.safeParse({
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return validatedFields.error.errors[0]?.message
  }

  const { content } = validatedFields.data
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return "User must be logged in"
  }

  await prisma.post.create({ data: { content, userId } })
  revalidatePath("/")
}
