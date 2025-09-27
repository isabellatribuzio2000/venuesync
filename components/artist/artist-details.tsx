'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Artist {
  id: string
  name: string
  bio?: string
  genres?: string[]
  followers?: number
  image_url?: string
}

interface ArtistDetailsProps {
  artist: Artist
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{artist.name}</CardTitle>
        <CardDescription>Artist Profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artist.image_url && (
            <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={artist.image_url} 
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {artist.bio && (
            <div>
              <h4 className="font-semibold mb-2">Bio</h4>
              <p className="text-sm text-muted-foreground">{artist.bio}</p>
            </div>
          )}
          
          {artist.genres && artist.genres.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {artist.followers && (
            <div>
              <h4 className="font-semibold mb-2">Followers</h4>
              <p className="text-sm text-muted-foreground">
                {artist.followers.toLocaleString()} followers
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
