import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        soft: "var(--soft)",
        accent: "var(--accent)",
        "accent-variant": "var(--accent-variant)",
        subtle: "var(--subtle)",
        border: "var(--border)",
        "subtle-foreground": "var(--subtle-foreground)",
        danger: "var(--danger)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        rise: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        new: {
          "0%": { "background-color": "var(--subtle)" },
          "100%": { "background-color": "var(--background)" },
        },
      },
      animation: {
        rise: "rise 150ms ease-in-out both",
        new: "new 500ms ease-in both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
