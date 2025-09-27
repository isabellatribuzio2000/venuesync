import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingPage } from "@/components/ui/loading"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VenueSync - Music Industry Strategy & Innovation",
  description:
    "Developing next-generation solutions for streaming platform integration with live entertainment markets",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} ${poppins.variable}`}>
        <ErrorBoundary>
          <div className="flex h-screen bg-[#1a1a1a]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Suspense fallback={<LoadingPage />}>
                {children}
              </Suspense>
            </main>
          </div>
        </ErrorBoundary>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
