'use client'

import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"

export default function AuthProvider({
  children,
}: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}