import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Determine provider from user metadata or session
      const provider = data.user.app_metadata?.provider || 'email'
      
      // Extract user information based on provider
      let firstName = ''
      let lastName = ''
      let userType = 'venue_manager' // default
      let additionalData: any = {}
      
      if (provider === 'google') {
        const fullName = data.user.user_metadata?.full_name || ''
        firstName = fullName.split(' ')[0] || ''
        lastName = fullName.split(' ').slice(1).join(' ') || ''
        userType = 'venue_manager'
        
        additionalData = {
          google_id: data.user.user_metadata?.sub,
          avatar_url: data.user.user_metadata?.avatar_url,
          email_verified: data.user.user_metadata?.email_verified
        }
      } else if (provider === 'spotify') {
        const displayName = data.user.user_metadata?.full_name || data.user.user_metadata?.display_name || ''
        firstName = displayName.split(' ')[0] || ''
        lastName = displayName.split(' ').slice(1).join(' ') || ''
        userType = 'artist'
        
        additionalData = {
          spotify_id: data.user.user_metadata?.provider_id,
          avatar_url: data.user.user_metadata?.avatar_url,
          spotify_display_name: data.user.user_metadata?.display_name,
          spotify_country: data.user.user_metadata?.country,
          spotify_followers: data.user.user_metadata?.followers?.total || 0
        }

        // Store Spotify access token for API calls
        if (data.session?.provider_token) {
          await storeSpotifyToken(supabase, data.user.id, {
            access_token: data.session.provider_token,
            refresh_token: data.session.provider_refresh_token,
            expires_at: new Date(Date.now() + 3600 * 1000) // 1 hour from now
          })
        }
      }

      // Create or update profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Create new profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            user_type: userType,
            first_name: firstName,
            last_name: lastName,
            avatar_url: additionalData.avatar_url,
            ...additionalData,
            created_at: new Date(),
            updated_at: new Date()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          return NextResponse.redirect(`${origin}/auth/login?error=profile_creation_failed`)
        }

        // For Spotify users, also create artist record
        if (provider === 'spotify' && additionalData.spotify_id) {
          await createArtistRecord(supabase, data.user.id, additionalData)
        }

      } else {
        // Update existing profile with latest info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            email: data.user.email,
            first_name: firstName || existingProfile.first_name,
            last_name: lastName || existingProfile.last_name,
            avatar_url: additionalData.avatar_url || existingProfile.avatar_url,
            updated_at: new Date()
          })
          .eq('id', data.user.id)

        if (profileError) {
          console.error('Profile update error:', profileError)
        }

        // Use existing user_type for redirect
        userType = existingProfile.user_type
      }

      // Redirect based on user type with success message
      const successParam = '?auth=success'
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
      
      switch (userType) {
        case 'artist':
          return NextResponse.redirect(`${baseUrl}/dashboard/artist${successParam}`)
        case 'venue':
          return NextResponse.redirect(`${baseUrl}/dashboard/venue${successParam}`)
        case 'admin':
          return NextResponse.redirect(`${baseUrl}/dashboard/admin${successParam}`)
        default:
          return NextResponse.redirect(`${baseUrl}/dashboard/artist${successParam}`)
      }
    } else {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${origin}/auth/login?error=auth_exchange_failed`)
    }
  }

  // Return the user to an error page with missing code
  return NextResponse.redirect(`${origin}/auth/login?error=missing_auth_code`)
}

// Helper function to store Spotify tokens for API access
async function storeSpotifyToken(supabase: any, userId: string, tokenData: any) {
  try {
    const { error } = await supabase
      .from('spotify_tokens')
      .upsert({
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing Spotify token:', error)
    }
  } catch (error) {
    console.error('Error in storeSpotifyToken:', error)
  }
}

// Helper function to create artist record for Spotify users
async function createArtistRecord(supabase: any, userId: string, spotifyData: any) {
  try {
    // Check if artist record already exists
    const { data: existingArtist } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!existingArtist) {
      const { error } = await supabase
        .from('artists')
        .insert({
          user_id: userId,
          spotify_id: spotifyData.spotify_id,
          name: spotifyData.spotify_display_name,
          followers_count: spotifyData.spotify_followers || 0,
          country: spotifyData.spotify_country,
          profile_image_url: spotifyData.avatar_url,
          is_verified: true, // Spotify users are verified
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating artist record:', error)
      }
    }
  } catch (error) {
    console.error('Error in createArtistRecord:', error)
  }
}
