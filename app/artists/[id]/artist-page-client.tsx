'use client'

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArtistDetails } from "@/components/artist/artist-details"
import { ArtistSpotifyData } from "@/components/artist/artist-spotify-data"
import { ArtistBookingForm } from "@/components/artist/artist-booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Music, 
  Users, 
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  ExternalLink,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ArtistPageClientProps {
  params: {
    id: string
  }
}

export function ArtistPageClient({ params }: ArtistPageClientProps) {
  const { id } = params
  const [artist, setArtist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArtist() {
      const supabase = createClient()
      
      if (!supabase) {
        setError("Application is not properly configured")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("artists")
          .select("*")
          .eq("id", id)
          .single()

        if (error) {
          console.error("Error fetching artist:", error)
          setError("Failed to load artist data")
        } else {
          setArtist(data)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load artist data")
      } finally {
        setLoading(false)
      }
    }

    fetchArtist()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading artist...</p>
        </div>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Artist Not Found</h1>
          <p className="text-gray-400">
            {error || "The artist you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${artist.image_url || '/placeholder.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 flex items-end h-full p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="bg-green-600 text-white">
                {artist.genre}
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                {artist.location}
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">{artist.name}</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl">
              {artist.bio || "Discover amazing music and book this artist for your venue."}
            </p>
            
            <div className="flex items-center gap-6">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Listen Now
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                <Calendar className="w-4 h-4 mr-2" />
                Book Artist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Artist Details */}
            <ArtistDetails artist={artist} />
            
            {/* Spotify Data */}
            <ArtistSpotifyData artistId={artist.id} />
            
            {/* Booking Form */}
            <ArtistBookingForm artistId={artist.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Followers</span>
                  </div>
                  <span className="text-white font-semibold">
                    {artist.followers?.toLocaleString() || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Tracks</span>
                  </div>
                  <span className="text-white font-semibold">
                    {artist.track_count || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Popularity</span>
                  </div>
                  <span className="text-white font-semibold">
                    {artist.popularity || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{artist.location}</span>
                </div>
                
                {artist.email && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`mailto:${artist.email}`}
                      className="text-green-400 hover:text-green-300"
                    >
                      {artist.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.spotify_url && (
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                    asChild
                  >
                    <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                      <Music className="w-4 h-4 mr-2" />
                      Spotify
                    </a>
                  </Button>
                )}
                
                {artist.instagram_url && (
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                    asChild
                  >
                    <a href={artist.instagram_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
