"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Users, Star, TrendingUp, MessageSquare } from "lucide-react"
import Image from "next/image"

interface ArtistMatchingAlgorithmProps {
  venueId: string | undefined
}

const matchedArtists = [
  {
    id: "1",
    name: "Bad Bunny",
    followers: 65000000,
    matchScore: 95,
    genres: ["reggaeton", "latin trap"],
    image: "https://i.scdn.co/image/ab6761610000e5eb4a21b4760d2ecb7b0dcdc8da",
    estimatedAttendance: 18500,
    ticketDemand: "Very High",
    revenueProjection: 2800000,
  },
  {
    id: "2",
    name: "Taylor Swift",
    followers: 92000000,
    matchScore: 88,
    genres: ["pop", "country"],
    image: "https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4",
    estimatedAttendance: 20000,
    ticketDemand: "Extremely High",
    revenueProjection: 3500000,
  },
  {
    id: "3",
    name: "Drake",
    followers: 85000000,
    matchScore: 82,
    genres: ["hip hop", "rap"],
    image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
    estimatedAttendance: 17200,
    ticketDemand: "High",
    revenueProjection: 2400000,
  },
]

export function ArtistMatchingAlgorithm({ venueId }: ArtistMatchingAlgorithmProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "Extremely High":
        return "destructive"
      case "Very High":
        return "default"
      case "High":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Artist Matching Algorithm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          AI-powered matching based on venue capacity, location demographics, and artist fan data
        </div>

        {matchedArtists.map((artist) => (
          <div key={artist.id} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-4 mb-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image src={artist.image || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{artist.name}</h4>
                  <Badge variant="default" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {artist.matchScore}% match
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-3 w-3" />
                  {formatFollowers(artist.followers)} followers
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {artist.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Match Score</span>
                <span className="font-medium">{artist.matchScore}%</span>
              </div>
              <Progress value={artist.matchScore} className="h-2" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Est. Attendance</div>
                  <div className="font-medium">{artist.estimatedAttendance.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Revenue Projection</div>
                  <div className="font-medium">{formatRevenue(artist.revenueProjection)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ticket Demand</span>
                  <Badge variant={getDemandColor(artist.ticketDemand)} className="text-xs">
                    {artist.ticketDemand}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button className="w-full bg-transparent" variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Refresh Recommendations
        </Button>
      </CardContent>
    </Card>
  )
}
