import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
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

interface ArtistPageProps {
  params: {
    id: string
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const supabase = await createClient()
  const { id } = params

  // Get artist data
  const { data: artist, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !artist) {
    notFound()
  }

  // Get user profile to check if they can book
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single() : { data: null }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return "text-green-400"
    if (popularity >= 60) return "text-yellow-400"
    if (popularity >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getPopularityLabel = (popularity: number) => {
    if (popularity >= 80) return "Superstar"
    if (popularity >= 60) return "Very Popular"
    if (popularity >= 40) return "Popular"
    if (popularity >= 20) return "Rising"
    return "Emerging"
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Music className="w-8 h-8 text-[#10b981]" />
                <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
                <Badge 
                  className={cn(
                    "text-white",
                    getPopularityColor(artist.popularity)
                  )}
                >
                  {getPopularityLabel(artist.popularity)}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-gray-400 mb-2">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{formatFollowers(artist.followers)} followers</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>{artist.popularity}% popularity</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                  <span>4.8 rating</span>
                </div>
              </div>
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {artist.genres.map((genre, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Artist Image */}
            {artist.image_url && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={artist.image_url}
                      alt={artist.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {artist.external_urls?.spotify && (
                      <Button
                        onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                        className="absolute bottom-4 right-4 bg-[#1DB954] hover:bg-[#1ed760] text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play on Spotify
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spotify Data */}
            <ArtistSpotifyData artistId={artist.id} />

            {/* Artist Details */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Artist Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="text-sm text-gray-400">Followers</p>
                      <p className="text-white font-semibold">{formatFollowers(artist.followers)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="text-sm text-gray-400">Popularity</p>
                      <p className="text-white font-semibold">{artist.popularity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="text-sm text-gray-400">Genres</p>
                      <p className="text-white font-semibold">{artist.genres?.join(", ") || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="text-sm text-gray-400">Rating</p>
                      <p className="text-white font-semibold">4.8/5.0</p>
                    </div>
                  </div>
                </div>

                {artist.external_urls?.spotify && (
                  <div className="pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Spotify
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Form */}
            {user && profile?.user_type === "venue" && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book This Artist
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Send a booking request to this artist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ArtistBookingForm artistId={artist.id} />
                </CardContent>
              </Card>
            )}

            {/* Login Prompt for Non-Venues */}
            {!user && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Want to Book This Artist?</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in as a venue to request bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => window.location.href = "/auth/login"}
                    className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                  >
                    Sign In to Book
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Artist Actions */}
            {user && profile?.user_type === "artist" && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Manage Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => window.location.href = `/artists/${artist.id}/edit`}
                    className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = "/dashboard/artist"}
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Followers</span>
                  <span className="text-white font-semibold">{formatFollowers(artist.followers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Popularity</span>
                  <span className="text-white font-semibold">{artist.popularity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Genres</span>
                  <span className="text-white font-semibold">{artist.genres?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-semibold">4.8/5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
