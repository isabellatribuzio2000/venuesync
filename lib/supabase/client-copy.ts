// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Add debugging for production
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      `URL: ${supabaseUrl ? 'SET' : 'MISSING'}, ` +
      `Key: ${supabaseKey ? 'SET' : 'MISSING'}`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Alternative: Hardcoded fallback for production debugging
export function createClientWithFallback() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oygovsqgqghotwpxuxvg.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Z292c3FncWdob3R3cHh1eHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTM1MzEsImV4cCI6MjA3NDI4OTUzMX0.0zKR-tBJiJr6NbW_UpWC7NLiuPzUWGh_mHu5Mw7TXq8'

  return createBrowserClient(supabaseUrl, supabaseKey)
}
