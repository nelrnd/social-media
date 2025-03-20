import type { Metadata } from "next"
import "./globals.css"
import { spaceGrotesk } from "./fonts"

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
