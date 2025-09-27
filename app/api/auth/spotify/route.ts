import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = 'edge'

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // If no code, redirect to Spotify authorization
  if (!code && !error) {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-follow-read",
      "user-read-recently-played",
      "user-top-read",
      "user-read-playback-position",
      "user-library-read",
      "playlist-read-private",
    ].join(" ")

    const params = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: REDIRECT_URI,
    })

    return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`)
  }

  // Handle authorization errors
  if (error) {
    return NextResponse.redirect("/auth/login?error=spotify_auth_failed")
  }

  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.redirect(new URL("/auth/login?error=configuration_error", request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code: code!,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Failed to get access token")
    }

    // Get user profile from Spotify
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const spotifyProfile = await profileResponse.json()

    if (!profileResponse.ok) {
      throw new Error("Failed to get Spotify profile")
    }

    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", spotifyProfile.email)
      .single()

    let user

    if (existingUser) {
      // Update existing user with Spotify data
      const { error: artistError } = await supabase.from("artists").upsert({
        spotify_id: spotifyProfile.id,
        name: spotifyProfile.display_name || spotifyProfile.id,
        followers: spotifyProfile.followers?.total || 0,
        image_url: spotifyProfile.images?.[0]?.url,
        external_urls: spotifyProfile.external_urls,
        updated_at: new Date().toISOString(),
      })

      if (artistError) console.error("Error updating artist record:", artistError)
      user = existingUser
    } else {
      // Create new user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: spotifyProfile.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: spotifyProfile.email,
            user_type: "artist",
            first_name: spotifyProfile.display_name?.split(" ")[0] || "Artist",
            last_name: spotifyProfile.display_name?.split(" ").slice(1).join(" ") || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (profileError) throw profileError

        // Create artist record
        const { error: artistError } = await supabase.from("artists").insert({
          spotify_id: spotifyProfile.id,
          name: spotifyProfile.display_name || spotifyProfile.id,
          followers: spotifyProfile.followers?.total || 0,
          image_url: spotifyProfile.images?.[0]?.url,
          external_urls: spotifyProfile.external_urls,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (artistError) console.error("Error creating artist record:", artistError)

        user = profileData
      }
    }

    // Store Spotify tokens
    const { error: tokenError } = await supabase.from("spotify_tokens").upsert({
      user_id: user.id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (tokenError) console.error("Error storing Spotify tokens:", tokenError)

    // Redirect to appropriate dashboard
    const redirectUrl =
      user.user_type === "artist" ? "/dashboard/artist?spotify=connected" : "/dashboard/artist?spotify=connected"

    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error("Spotify auth error:", error)
    return NextResponse.redirect(new URL("/auth/login?error=spotify_auth_failed", request.url))
  }
}
