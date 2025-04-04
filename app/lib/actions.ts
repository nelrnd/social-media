"use server"

import { auth, signIn, signOut } from "@/auth"
import { prisma } from "@/app/lib/prisma"
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
      user: {
        select: {
          profile: {
            include: {
              followers: { select: { id: true } },
              following: { select: { id: true } },
            },
          },
        },
      },
      likes: { select: { id: true, userId: true } },
      comments: { select: { id: true } },
    },
  })
  revalidatePath("/")
  return { success: true, post }
}

export async function deletePost(
  prevState: string | undefined,
  formData: FormData
) {
  const { userId } = await getUserData()
  const postId = formData.get("postId") as string
  const redirectTo = formData.get("redirectTo") as string

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { userId: true, comments: { select: { id: true } } },
  })

  if (!post) {
    throw new Error("Cannot delete post: post not found")
  }
  if (post.userId !== userId) {
    throw new Error("Cannot delete post: not authorized")
  }

  await Promise.all([
    prisma.like.deleteMany({ where: { postId } }),
    prisma.comment.deleteMany({ where: { postId } }),
    prisma.like.deleteMany({
      where: { commentId: { in: post.comments.map((comment) => comment.id) } },
    }),
    prisma.notification.deleteMany({ where: { postId } }),
  ])

  await prisma.post.delete({ where: { id: postId } })

  revalidatePath("/")
  redirect(redirectTo)
  return "Post deleted successfully"
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
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name cannot exceed 20 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username cannot exceed 20 characters")
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
    .max(20, "Username cannot exceed 20 characters")
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
  currentPath: z.string(),
})

export async function commentPost(
  prevState: CommentFormState,
  formData: FormData
) {
  const validatedFields = CommentFormSchema.safeParse({
    content: formData.get("content"),
    postId: formData.get("postId"),
    currentPath: formData.get("currentPath"),
  })

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0]?.message, success: false }
  }

  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return { message: "User must be logged in", success: false }
  }

  const { content, postId, currentPath } = validatedFields.data

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
  revalidatePath("/post/" + postId)
  if (currentPath === "/post/" + postId) {
    redirect("/post/" + postId)
  } else {
    return { message: "", success: true, comment }
  }
}

export async function deleteComment(
  prevState: string | undefined,
  formData: FormData
) {
  const { userId } = await getUserData()
  const commentId = formData.get("commentId") as string
  const redirectTo = formData.get("redirectTo") as string

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  })

  if (!comment) {
    throw new Error("Cannot delete comment: comment not found")
  }
  if (comment.userId !== userId) {
    throw new Error("Cannot delete comment: not authorized")
  }

  await prisma.like.deleteMany({ where: { commentId } })
  await prisma.comment.delete({ where: { id: commentId } })

  revalidatePath("/")
  redirect(redirectTo)
  return "Commment deleted successfully"
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

  await signOut()
  redirect("/")
}

export type SendConfirmationCodeState = {
  errors?: {
    email?: string[]
  }
  success?: boolean
}

const sendConfirmationCodeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Email format in invalid"),
  redirectTo: z
    .string()
    .min(1, "Callback url is required")
    .url("Callback url format is invalid"),
})

export async function sendConfirmationCode(
  prevState: SendConfirmationCodeState,
  formData: FormData
) {
  const validatedFields = sendConfirmationCodeSchema.safeParse({
    email: formData.get("email"),
    redirectTo: formData.get("redirectTo"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { email, redirectTo } = validatedFields.data

  console.log(redirectTo)

  const response = await signIn("nodemailer", {
    email,
    redirectTo,
    redirect: false,
  })

  if (response.error) {
    if (response.url) {
      redirect(response.url)
    } else {
      redirect(`/join?error=${encodeURIComponent(response.error)}`)
    }
  } else {
    return { success: true }
  }
}

export type VerifyConfirmationCodeState = {
  errors?: {
    email?: string[]
    otp?: string[]
    redirectTo?: string[]
  }
  requestUrl?: string
}

const verifyConfirmationCodeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Email format is invalid"),
  otp: z
    .string()
    .trim()
    .min(6, "Confirmation code is 6 characters long")
    .max(6, "Confirmation code is 6 characters long"),
  redirectTo: z
    .string()
    .min(1, "Callback url is required")
    .url("Callback url format is invalid"),
})

export async function verifyConfirmationCode(
  prevState: VerifyConfirmationCodeState,
  formData: FormData
) {
  const validatedFields = verifyConfirmationCodeSchema.safeParse({
    email: formData.get("email"),
    otp: formData.get("otp"),
    redirectTo: formData.get("redirectTo"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { email, otp, redirectTo } = validatedFields.data

  const formattedEmail = encodeURIComponent(email.toLowerCase())
  const formattedOtp = encodeURIComponent(otp)
  const formattedCallback = encodeURIComponent(redirectTo)
  const otpRequestURL = `/api/auth/callback/nodemailer?email=${formattedEmail}&token=${formattedOtp}&callbackUrl=${formattedCallback}`

  return { requestUrl: otpRequestURL }
}

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: formData.get("redirectTo") as string })
}

export async function signInWithGithub(formData: FormData) {
  await signIn("github", { redirectTo: formData.get("redirectTo") as string })
}
