"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Music, 
  Users, 
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Artist {
  id: string
  name: string
  spotify_id?: string
  image_url?: string
  genres?: string[]
  popularity?: number
  followers?: number
  bio?: string
  website_url?: string
  social_links?: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
  }
  created_at: string
  updated_at: string
}

interface ArtistDetailsProps {
  artist: Artist
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Artist Profile */}
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {artist.image_url && (
              <img
                src={artist.image_url}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{artist.name}</h1>
              <div className="flex items-center gap-6 text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{artist.followers?.toLocaleString() || 0} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{artist.popularity || 0}% popularity</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>4.8 rating</span>
                </div>
              </div>
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {artist.genres.slice(0, 5).map((genre, index) => (
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
        </CardContent>
      </Card>

      {/* Bio */}
      {artist.bio && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">About {artist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Social Links */}
      {artist.social_links && Object.keys(artist.social_links).length > 0 && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {artist.social_links.instagram && (
                <a
                  href={artist.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#0d9d6b] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Instagram
                </a>
              )}
              {artist.social_links.twitter && (
                <a
                  href={artist.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#0d9d6b] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Twitter
                </a>
              )}
              {artist.social_links.facebook && (
                <a
                  href={artist.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#0d9d6b] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Facebook
                </a>
              )}
              {artist.social_links.youtube && (
                <a
                  href={artist.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#0d9d6b] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  YouTube
                </a>
              )}
              {artist.website_url && (
                <a
                  href={artist.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#0d9d6b] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Followers</p>
                <p className="text-2xl font-bold text-white">{artist.followers?.toLocaleString() || 0}</p>
              </div>
              <Users className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Popularity</p>
                <p className="text-2xl font-bold text-white">{artist.popularity || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Rating</p>
                <p className="text-2xl font-bold text-white">4.8</p>
              </div>
              <Star className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
