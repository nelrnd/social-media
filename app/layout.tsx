import type { Metadata } from "next"
import "./globals.css"
import { spaceGrotesk } from "./fonts"
import { ThemeProvider } from "next-themes"

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="bg-background text-primary">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
