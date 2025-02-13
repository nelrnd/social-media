import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import NavBar from "./ui/nav-bar"

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AHSI - Social Media",
  description: "AHSI is a social media app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
