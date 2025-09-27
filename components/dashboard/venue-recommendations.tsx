"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Star, Calendar } from "lucide-react"

interface VenueRecommendationsProps {
  artistId: string | undefined
}

const recommendedVenues = [
  {
    id: "1",
    name: "Madison Square Garden",
    location: "New York, NY",
    capacity: 20789,
    matchScore: 95,
    type: "Arena",
    availableDates: ["2024-03-15", "2024-03-22", "2024-04-05"],
    estimatedRevenue: 2500000,
  },
  {
    id: "2",
    name: "The Fillmore",
    location: "San Francisco, CA",
    capacity: 1315,
    matchScore: 88,
    type: "Theater",
    availableDates: ["2024-03-10", "2024-03-17", "2024-03-24"],
    estimatedRevenue: 180000,
  },
  {
    id: "3",
    name: "Red Rocks Amphitheatre",
    location: "Morrison, CO",
    capacity: 9525,
    matchScore: 92,
    type: "Amphitheater",
    availableDates: ["2024-04-12", "2024-04-19", "2024-05-03"],
    estimatedRevenue: 950000,
  },
]

export function VenueRecommendations({ artistId }: VenueRecommendationsProps) {
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  const formatCapacity = (capacity: number) => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K`
    }
    return capacity.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Venue Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedVenues.map((venue) => (
          <div key={venue.id} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{venue.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {venue.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {venue.matchScore}% match
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{formatCapacity(venue.capacity)} capacity</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{venue.availableDates.length} dates available</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline">{venue.type}</Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  Est. Revenue: {formatRevenue(venue.estimatedRevenue)}
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
