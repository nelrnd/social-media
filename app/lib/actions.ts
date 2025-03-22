"use server"

import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcrypt"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { NotificationType, Prisma } from "@prisma/client"
import { redirect } from "next/navigation"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { PostId, PostWithRelations } from "./definitions"
import { getUserData } from "./data"

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
  post?: PostWithRelations | null
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

  const post = await prisma.post.create({
    data: {
      content,
      userId,
      images: imageUrls.filter((url) => typeof url === "string"),
    },
    include: {
      user: { select: { profile: true } },
      likes: { select: { id: true, userId: true } },
      comments: { select: { id: true } },
    },
  })
  revalidatePath("/")
  return { success: true, post }
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

export async function likePost(postId: PostId) {
  if (!postId) {
    return { error: "Post id required" }
  }
  const { userId } = await getUserData()
  const existingLike = await prisma.like.findFirst({
    where: { postId, userId },
  })
  if (!existingLike) {
    await prisma.like.create({ data: { postId, userId } })
    createNotification({ type: "LIKE", fromId: userId, postId })
  } else {
    await prisma.like.delete({ where: { id: existingLike.id } })
  }
  revalidatePath("/")
  const message = !existingLike
    ? "Post liked successfully"
    : "Post unliked successfully"
  const likes = await prisma.like.findMany({
    where: { postId },
    select: { id: true, userId: true },
  })
  return { message, likes }
}

export async function likeComment(commentId: string) {
  if (!commentId) return { error: "Comment id is required" }
  const { userId } = await getUserData()
  const existingLike = await prisma.like.findFirst({
    where: { userId, commentId },
  })
  if (!existingLike) {
    await prisma.like.create({ data: { commentId, userId } })
  } else {
    await prisma.like.delete({ where: { id: existingLike.id } })
  }
  revalidatePath("/")
  const message = !existingLike
    ? "Comment liked successfully"
    : "Comment unliked successfully"
  const likes = await prisma.like.findMany({
    where: { commentId },
    select: { id: true, userId: true },
  })
  return { message, likes }
}

export type CommentFormState = {
  message?: string | null
  success?: boolean | null
  comment?: Prisma.CommentGetPayload<{ select: { id: true } }> | null
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

  const comment = await prisma.comment.create({
    data: { content, userId, postId },
    select: { id: true },
  })
  createNotification({
    type: "COMMENT",
    fromId: userId,
    postId,
    commentId: comment.id,
  })
  revalidatePath("/")
  return { message: "", success: true, comment }
}

export async function followProfile(profileId: string) {
  const { userId, profileId: authProfileId } = await getUserData()
  if (!profileId) {
    return "Profile id is required"
  }
  if (profileId === authProfileId) {
    return "User cannot follow himself"
  }
  const follow = await prisma.follow.findFirst({
    where: { followingId: profileId, followerId: authProfileId },
  })
  if (!follow) {
    const newFollow = await prisma.follow.create({
      data: { followingId: profileId, followerId: authProfileId },
      select: { following: { select: { user: { select: { id: true } } } } },
    })
    createNotification({
      type: "FOLLOW",
      fromId: userId,
      toId: newFollow.following.user.id,
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

async function createNotification({
  type,
  fromId,
  toId,
  postId,
  commentId,
}: {
  type: NotificationType
  fromId: string
  toId?: string
  postId?: string
  commentId?: string
}) {
  if (!toId && postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return
    toId = post.userId
  }
  if (fromId === toId || !fromId || !toId) {
    return
  }
  if (["FOLLOW", "LIKE"].includes(type)) {
    // notification should be unique
    const notification = await prisma.notification.findFirst({
      where: { type, fromId, toId, postId, commentId },
    })
    if (notification) return
  }
  await prisma.notification.create({
    data: { type, fromId, toId, postId, commentId },
  })
  console.log("Creating notification")
}

export async function readAllNotifications() {
  const { userId } = await getUserData()
  await prisma.notification.updateMany({
    where: { toId: userId },
    data: { isRead: true },
  })
}

export async function deleteUser() {
  const { userId, profileId } = await getUserData()

  await prisma.like.deleteMany({ where: { userId } })
  await prisma.comment.deleteMany({ where: { userId } })
  await prisma.follow.deleteMany({ where: { followerId: profileId } })
  await prisma.post.deleteMany({ where: { userId } })
  await prisma.notification.deleteMany({ where: { fromId: userId } })
  await prisma.profile.delete({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } })

  redirect("/")
}
