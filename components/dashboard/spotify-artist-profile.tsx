"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, TrendingUp, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Artist {
  id: string
  spotify_id: string
  name: string
  followers: number
  genres: string[]
  popularity: number
  image_url: string
}

interface SpotifyArtistProfileProps {
  artist: Artist | null
}

export function SpotifyArtistProfile({ artist }: SpotifyArtistProfileProps) {
  if (!artist) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">No artist data available</div>
        </CardContent>
      </Card>
    )
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#1DB954]/10">
              <Music className="h-5 w-5 text-[#1DB954]" />
            </div>
            Spotify Profile
          </div>
          <Button variant="ghost" size="sm" className="text-[#1DB954] hover:bg-[#1DB954]/10">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden ring-2 ring-[#1DB954]/20">
            <Image
              src={artist.image_url || "/placeholder.svg?height=80&width=80&query=artist profile"}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-foreground mb-1">{artist.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-[#1DB954]">{formatFollowers(artist.followers)}</span>
              <span>followers</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#1DB954]" />
              <span className="text-sm font-medium">Popularity</span>
              <Badge variant="secondary" className="bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20">
                {artist.popularity}/100
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-semibold text-foreground">Genres</span>
          <div className="flex flex-wrap gap-2">
            {artist.genres.map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className="text-xs bg-background/50 border-border hover:bg-[#1DB954]/10 hover:border-[#1DB954]/30 transition-colors"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#1DB954] animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Connected to Spotify</span>
            </div>
            <span className="text-xs text-muted-foreground">Last updated: Just now</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
