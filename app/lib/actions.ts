"use server"

import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_FILE_SIZE = 2000000 // 2mb

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

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

export interface Image {
  file: File
  id: string
  url: string
}

const PostFormSchema = z.object({
  content: z.string(),
  images: z
    .custom<Image[]>()
    .refine(
      (images) => images.every((image) => image.file.size <= MAX_FILE_SIZE),
      "Cannot upload images bigger than 2MB"
    )
    .refine(
      (images) =>
        images.every((image) => ACCEPTED_IMAGE_TYPES.includes(image.file.type)),
      "Image format is not supported (only .jpg, .jpeg, .png and .webp are valid."
    ),
})

export type PostFormState = {
  error?: string | null
  success?: boolean | null
}

export async function createPost(
  imageFiles: Image[],
  prevState: PostFormState,
  formData: FormData
) {
  const validatedFields = PostFormSchema.safeParse({
    content: formData.get("content"),
    images: imageFiles,
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0]?.message, success: false }
  }

  const { content, images } = validatedFields.data

  if (!content && !images.length) {
    return { error: "Post cannot be empty", success: false }
  }

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return { error: "User must be logged in", success: false }
  }

  const imageUrls = await Promise.all(
    images.map(async (image) => uploadImage(image.file))
  )

  await prisma.post.create({
    data: {
      content,
      userId,
      images: imageUrls.filter((url) => typeof url === "string"),
    },
  })
  revalidatePath("/")
  return { success: true }
}

export type ProfileFormState = {
  errors?: {
    name?: string[]
    username?: string[]
    bio?: string[]
    image?: string[]
  }
  message?: string | null
  data?: FormData
}

const CreateProfileFormSchema = z.object({
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
  image: z
    .any()
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Cannot upload images bigger than 2MB"
    )
    .transform((file) => (file.size ? file : null))
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Image format is not supported (only .jpg, .jpeg, .png and .webp are valid."
    ),
})

export async function createProfile(
  prevState: ProfileFormState,
  formData: FormData
) {
  const validatedFields = await CreateProfileFormSchema.safeParseAsync({
    name: formData.get("name"),
    username: formData.get("username"),
    bio: formData.get("bio"),
    image: formData.get("image"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: formData,
    }
  }

  const { name, username, bio, image } = validatedFields.data
  const session = await auth()
  const userId = session?.user?.id as string
  const imageUrl = await uploadImage(image)

  if (!userId) {
    return { message: "User must be logged in" }
  }

  try {
    await prisma.profile.create({
      data: { name, username, bio, imageUrl, userId },
    })
  } catch (error) {
    console.log(error)
    throw error
  }

  redirect("/")
}

const UpdateProfileFormSchema = CreateProfileFormSchema.extend({
  id: z.string().min(1, "Profile id is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(4, "Username must be at least 4 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username must only contain letters, numbers, "-" and "_"'
    ),
}).superRefine(async (data, ctx) => {
  const profile = await prisma.profile.findUnique({
    where: { username: data.username, NOT: { id: data.id } },
  })

  if (profile) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Username is already taken",
      path: ["username"],
    })
  }
})

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
) {
  const validatedFields = await UpdateProfileFormSchema.safeParseAsync({
    id: formData.get("id"),
    name: formData.get("name"),
    username: formData.get("username"),
    bio: formData.get("bio"),
    image: formData.get("image"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: formData,
    }
  }

  const { id, name, username, bio, image } = validatedFields.data
  const session = await auth()
  const userId = session?.user?.id as string
  const imageUrl = await uploadImage(image)

  if (!userId) {
    return { message: "User must be logged in" }
  }

  try {
    await prisma.profile.update({
      where: { id, userId },
      data: { name, username, bio, imageUrl },
    })
  } catch (error) {
    console.log(error)
    throw error
  }

  revalidatePath("/")
  redirect(`/profile/${username}`)
}

export async function likePost(postId: string) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!session) {
    return "User must be logged in"
  }
  if (!postId) {
    return "Post id is required"
  }
  const like = await prisma.like.findFirst({
    where: { userId, postId },
  })
  if (!like) {
    await prisma.like.create({ data: { userId, postId } })
    revalidatePath("/")
    return "Post liked successfully"
  } else {
    await prisma.like.delete({ where: { id: like.id } })
    revalidatePath("/")
    return "Post unliked successfully"
  }
}

export async function likeComment(commentId: string) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!session) {
    return "User must be logged in"
  }
  if (!commentId) {
    return "Comment id is required"
  }
  const like = await prisma.like.findFirst({ where: { userId, commentId } })
  if (!like) {
    await prisma.like.create({ data: { userId, commentId } })
    revalidatePath("/")
    return "Comment liked successfully"
  } else {
    await prisma.like.delete({ where: { id: like.id } })
    revalidatePath("/")
    return "Comment unliked successfully"
  }
}

export type CommentFormState = {
  message?: string | null
  success?: boolean | null
}

const CommentFormSchema = z.object({
  content: z.string().min(1, "Your comment cannot be empty"),
  postId: z.string().min(1, "Post id is required"),
})

export async function commentPost(
  prevState: CommentFormState,
  formData: FormData
) {
  const validatedFields = CommentFormSchema.safeParse({
    content: formData.get("content"),
    postId: formData.get("postId"),
  })

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0]?.message, success: false }
  }

  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return { message: "User must be logged in", success: false }
  }

  const { content, postId } = validatedFields.data

  await prisma.comment.create({ data: { content, userId, postId } })
  revalidatePath("/")
  return { message: "", success: true }
}

export async function followProfile(profileId: string) {
  const session = await auth()
  const authProfileId = session?.user?.profile?.id as string
  if (!session || !profileId) {
    return "User must be logged in and profile id must be provided"
  }
  if (profileId === authProfileId) {
    return "User cannot follow himself"
  }
  const follow = await prisma.follow.findFirst({
    where: { followingId: profileId, followerId: authProfileId },
  })
  if (!follow) {
    await prisma.follow.create({
      data: { followingId: profileId, followerId: authProfileId },
    })
    revalidatePath("/")
    return "Profile followed successfully"
  } else {
    await prisma.follow.delete({ where: { id: follow.id } })
    revalidatePath("/")
    return "Profile unfollowed successfully"
  }
}

async function uploadImage(image: File): Promise<string | undefined> {
  if (!image) return
  const arrayBuffer = await image.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const result = (await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({}, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
      .end(buffer)
  })) as UploadApiResponse | undefined
  return result?.url
}
