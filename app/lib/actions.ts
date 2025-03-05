"use server"

import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

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

export type ProfileFormState = {
  errors?: {
    name?: string[]
    username?: string[]
    bio?: string[]
  }
  message?: string | null
  data?: FormData
}

const ProfileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(4, "Username must be at least 4 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username must only contain letters, numbers, "-" and "_"'
    )
    .refine(async (username) => {
      const profile = await prisma.profile.findUnique({ where: { username } })
      return !profile
    }, "Username is already taken"),
  bio: z.string(),
})

export async function createProfile(
  prevState: ProfileFormState,
  formData: FormData
) {
  const validatedFields = await ProfileFormSchema.safeParseAsync({
    name: formData.get("name"),
    username: formData.get("username"),
    bio: formData.get("bio"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: formData,
    }
  }

  const { name, username, bio } = validatedFields.data
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return { message: "User must be logged in" }
  }

  try {
    await prisma.profile.create({ data: { name, username, bio, userId } })
  } catch (error) {
    console.log(error)
    throw error
  }

  redirect("/")
}

export async function likePost(postId: string) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!session || !postId) {
    return "User must be logged in and post id must be provided"
  }
  const like = await prisma.like.findFirst({
    where: { userId, postId },
  })
  if (!like) {
    await prisma.like.create({ data: { userId, postId } })
    revalidatePath("/")
    return "Liked post successfully"
  } else {
    await prisma.like.delete({ where: { id: like.id } })
    revalidatePath("/")
    return "Unliked post successfully"
  }
}

const CommentFormSchema = z.object({
  content: z.string().min(1, "Your comment cannot be empty"),
  postId: z.string().min(1, "Post id is required"),
})

export async function commentPost(
  prevState: string | undefined,
  formData: FormData
) {
  const validatedFields = CommentFormSchema.safeParse({
    content: formData.get("content"),
    postId: formData.get("postId"),
  })

  if (!validatedFields.success) {
    return validatedFields.error.errors[0]?.message
  }

  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return "User must be logged in"
  }

  const { content, postId } = validatedFields.data

  await prisma.comment.create({ data: { content, userId, postId } })
  revalidatePath("/")
}

export async function followUser(userId: string) {
  const session = await auth()
  const authUserId = session?.user?.id as string
  if (!session || !userId) {
    return "User must be logged in and user id must be provided"
  }
  if (userId === authUserId) {
    return "User cannot follow himself"
  }
  const follow = await prisma.follow.findFirst({
    where: { followingId: userId, followerId: authUserId },
  })
  if (!follow) {
    await prisma.follow.create({
      data: { followingId: userId, followerId: authUserId },
    })
    revalidatePath("/")
    return "User followed successfully"
  } else {
    await prisma.follow.delete({ where: { id: follow.id } })
    revalidatePath("/")
    return "User unfollowed successfully"
  }
}
