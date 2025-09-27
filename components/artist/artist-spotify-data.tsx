"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import { 
  Music, 
  Play, 
  ExternalLink, 
  TrendingUp,
  Users,
  Clock,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SpotifyData {
  top_tracks: Array<{
    id: string
    name: string
    preview_url?: string
    external_urls: { spotify: string }
    duration_ms: number
    popularity: number
  }>
  recent_albums: Array<{
    id: string
    name: string
    images: Array<{ url: string; height: number; width: number }>
    external_urls: { spotify: string }
    release_date: string
  }>
  audio_features: {
    danceability: number
    energy: number
    valence: number
    tempo: number
  }
}

interface ArtistSpotifyDataProps {
  artistId: string
}

export function ArtistSpotifyData({ artistId }: ArtistSpotifyDataProps) {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadSpotifyData()
  }, [artistId])

  const loadSpotifyData = async () => {
    setLoading(true)
    try {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      // Get artist's Spotify ID
      const { data: artist } = await supabase
        .from("artists")
        .select("spotify_id")
        .eq("id", artistId)
        .single()

      if (!artist?.spotify_id) {
        setError("No Spotify data available")
        return
      }

      // Fetch Spotify data from our API
      const response = await fetch(`/api/spotify/artist-data?artist_id=${artist.spotify_id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch Spotify data")
      }

      const data = await response.json()
      setSpotifyData(data)
    } catch (error) {
      console.error("Error loading Spotify data:", error)
      setError("Failed to load Spotify data")
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Spotify Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading text="Loading Spotify data..." />
        </CardContent>
      </Card>
    )
  }

  if (error || !spotifyData) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Spotify Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">{error || "No Spotify data available"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Tracks */}
      {spotifyData.top_tracks && spotifyData.top_tracks.length > 0 && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Tracks
            </CardTitle>
            <CardDescription className="text-gray-400">
              Most popular tracks on Spotify
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spotifyData.top_tracks.slice(0, 5).map((track, index) => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{track.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{formatDuration(track.duration_ms)}</span>
                        <span>•</span>
                        <span>{track.popularity}% popularity</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {track.preview_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => {
                          const audio = new Audio(track.preview_url)
                          audio.play()
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => window.open(track.external_urls.spotify, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Albums */}
      {spotifyData.recent_albums && spotifyData.recent_albums.length > 0 && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5" />
              Recent Albums
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest releases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spotifyData.recent_albums.slice(0, 4).map((album) => (
                <div key={album.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  {album.images && album.images.length > 0 && (
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">{album.name}</p>
                    <p className="text-sm text-gray-400">{formatDate(album.release_date)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => window.open(album.external_urls.spotify, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Features */}
      {spotifyData.audio_features && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Audio Features
            </CardTitle>
            <CardDescription className="text-gray-400">
              Musical characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10b981] mb-1">
                  {Math.round(spotifyData.audio_features.danceability * 100)}%
                </div>
                <div className="text-sm text-gray-400">Danceability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10b981] mb-1">
                  {Math.round(spotifyData.audio_features.energy * 100)}%
                </div>
                <div className="text-sm text-gray-400">Energy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10b981] mb-1">
                  {Math.round(spotifyData.audio_features.valence * 100)}%
                </div>
                <div className="text-sm text-gray-400">Positivity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10b981] mb-1">
                  {Math.round(spotifyData.audio_features.tempo)} BPM
                </div>
                <div className="text-sm text-gray-400">Tempo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
