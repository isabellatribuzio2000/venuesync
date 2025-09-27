// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    // Get environment variables with fallbacks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oygovsqgqghotwpxuxvg.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Z292c3FncWdob3R3cHh1eHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTM1MzEsImV4cCI6MjA3NDI4OTUzMX0.0zKR-tBJiJr6NbW_UpWC7NLiuPzUWGh_mHu5Mw7TXq8'

    // Skip middleware if environment variables are not available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not available in middleware, skipping auth check')
      return supabaseResponse
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired - this is for session management only
    const { data: { user } } = await supabase.auth.getUser()

  } catch (error) {
    console.error('Middleware error:', error)
    // Don't break the app if middleware fails
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
