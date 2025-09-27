import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get("artist_id")

    if (!artistId) {
      return NextResponse.json({ error: "Artist ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user's Spotify token
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data } = await supabase
      .from("spotify_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("user_id", user.id)
      .single()

    if (!data) {
      return NextResponse.json({ error: "No Spotify token found" }, { status: 404 })
    }

    // Check if token is expired and refresh if needed
    let accessToken = data.access_token
    if (new Date() >= new Date(data.expires_at)) {
      const refreshResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: data.refresh_token,
        }),
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        accessToken = refreshData.access_token

        // Update token in database
        await supabase
          .from("spotify_tokens")
          .update({
            access_token: refreshData.access_token,
            expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
          })
          .eq("user_id", user.id)
      }
    }

    // FIXED: Fetch artist data from Spotify - removed duplicate audioFeaturesResponse
    const [topTracksResponse, albumsResponse] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=5&market=US`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ])

    if (!topTracksResponse.ok || !albumsResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 })
    }

    const [topTracks, albums] = await Promise.all([
      topTracksResponse.json(),
      albumsResponse.json(),
    ])

    // Get audio features for top tracks
    const trackIds = topTracks.tracks.slice(0, 5).map((track: any) => track.id).join(",")
    const audioFeaturesResponse = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    let audioFeatures = null
    if (audioFeaturesResponse.ok) {
      const audioFeaturesData = await audioFeaturesResponse.json()
      if (audioFeaturesData.audio_features && audioFeaturesData.audio_features.length > 0) {
        // Calculate average audio features
        const validFeatures = audioFeaturesData.audio_features.filter((f: any) => f !== null)
        if (validFeatures.length > 0) {
          audioFeatures = {
            danceability: validFeatures.reduce((sum: number, f: any) => sum + f.danceability, 0) / validFeatures.length,
            energy: validFeatures.reduce((sum: number, f: any) => sum + f.energy, 0) / validFeatures.length,
            valence: validFeatures.reduce((sum: number, f: any) => sum + f.valence, 0) / validFeatures.length,
            tempo: validFeatures.reduce((sum: number, f: any) => sum + f.tempo, 0) / validFeatures.length,
          }
        }
      }
    }

    return NextResponse.json({
      top_tracks: topTracks.tracks.slice(0, 5).map((track: any) => ({
        id: track.id,
        name: track.name,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
      })),
      recent_albums: albums.items.slice(0, 4).map((album: any) => ({
        id: album.id,
        name: album.name,
        images: album.images,
        external_urls: album.external_urls,
        release_date: album.release_date,
      })),
      audio_features: audioFeatures,
    })
  } catch (error) {
    console.error("Error fetching Spotify data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
