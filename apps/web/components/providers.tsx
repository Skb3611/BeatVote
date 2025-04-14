"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ClerkProvider } from "@clerk/nextjs"
import { SocketProvider } from "@/hooks/socketContext"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>

      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        >
          <SocketProvider>

      {children}
          </SocketProvider>
    </NextThemesProvider>
 </ClerkProvider>
  )
}
