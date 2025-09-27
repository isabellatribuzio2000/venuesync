// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
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

// Fallback function for production debugging
export function createClientWithFallback() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Use environment variables if available, otherwise use hardcoded fallback
  const supabaseUrl = envUrl || 'https://oygovsqgqghotwpxuxvg.supabase.co'
  const supabaseKey = envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Z292c3FncWdob3R3cHh1eHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTM1MzEsImV4cCI6MjA3NDI4OTUzMX0.0zKR-tBJiJr6NbW_UpWC7NLiuPzUWGh_mHu5Mw7TXq8'

  console.log('🔧 Supabase client source:', {
    url: envUrl ? 'ENVIRONMENT' : 'HARDCODED',
    key: envKey ? 'ENVIRONMENT' : 'HARDCODED'
  })

  return createBrowserClient(supabaseUrl, supabaseKey)
}