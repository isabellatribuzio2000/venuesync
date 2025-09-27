"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, MapPin, Users, Star, DollarSign, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface VenueRecommendation {
  id: string
  name: string
  location: string
  capacity: number
  matchScore: number
  estimatedRevenue: number
  availableDates: number
  venueType: string
  demandLevel: "Low" | "Medium" | "High" | "Very High"
  bookingProbability: number
}

const initialRecommendations: VenueRecommendation[] = [
  {
    id: "1",
    name: "Madison Square Garden",
    location: "New York, NY",
    capacity: 20789,
    matchScore: 95,
    estimatedRevenue: 2800000,
    availableDates: 3,
    venueType: "Arena",
    demandLevel: "Very High",
    bookingProbability: 87,
  },
  {
    id: "2",
    name: "The Fillmore",
    location: "San Francisco, CA",
    capacity: 1315,
    matchScore: 88,
    estimatedRevenue: 180000,
    availableDates: 8,
    venueType: "Theater",
    demandLevel: "High",
    bookingProbability: 92,
  },
  {
    id: "3",
    name: "Red Rocks Amphitheatre",
    location: "Morrison, CO",
    capacity: 9525,
    matchScore: 92,
    estimatedRevenue: 950000,
    availableDates: 5,
    venueType: "Amphitheater",
    demandLevel: "Very High",
    bookingProbability: 78,
  },
  {
    id: "4",
    name: "The Troubadour",
    location: "West Hollywood, CA",
    capacity: 400,
    matchScore: 85,
    estimatedRevenue: 45000,
    availableDates: 12,
    venueType: "Club",
    demandLevel: "Medium",
    bookingProbability: 95,
  },
]

export function VenueRecommendationEngine() {
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate AI recommendation updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRecommendations((prev) =>
        prev.map((venue) => ({
          ...venue,
          matchScore: Math.max(70, Math.min(100, venue.matchScore + (Math.random() * 6 - 3))),
          bookingProbability: Math.max(60, Math.min(100, venue.bookingProbability + (Math.random() * 10 - 5))),
          availableDates: Math.max(1, venue.availableDates + Math.floor(Math.random() * 3 - 1)),
        })),
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [])

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

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "Very High":
        return "destructive"
      case "High":
        return "default"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Shuffle and update recommendations
    setRecommendations((prev) =>
      prev
        .map((venue) => ({
          ...venue,
          matchScore: Math.floor(Math.random() * 30) + 70,
          bookingProbability: Math.floor(Math.random() * 40) + 60,
        }))
        .sort((a, b) => b.matchScore - a.matchScore),
    )
    setIsRefreshing(false)
  }

  const totalEstimatedRevenue = recommendations.reduce((sum, venue) => sum + venue.estimatedRevenue, 0)
  const avgMatchScore = recommendations.reduce((sum, venue) => sum + venue.matchScore, 0) / recommendations.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Venue Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Engine Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Avg Match</span>
            </div>
            <div className="text-lg font-semibold">{avgMatchScore.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">AI confidence score</div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="text-lg font-semibold">{formatRevenue(totalEstimatedRevenue)}</div>
            <div className="text-xs text-muted-foreground">Projected potential</div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Top Recommendations</h4>
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <Brain className="h-4 w-4 mr-2" />
              {isRefreshing ? "Analyzing..." : "Refresh AI"}
            </Button>
          </div>

          {recommendations.map((venue, index) => (
            <div key={venue.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{venue.name}</span>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {venue.location}
                  </div>
                </div>
                <Badge variant="default" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {venue.matchScore.toFixed(0)}%
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>AI Match Score</span>
                  <span className="font-medium">{venue.matchScore.toFixed(1)}%</span>
                </div>
                <Progress value={venue.matchScore} className="h-2" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{formatCapacity(venue.capacity)} capacity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{venue.availableDates} dates available</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {venue.venueType}
                    </Badge>
                    <Badge variant={getDemandColor(venue.demandLevel)} className="text-xs">
                      {venue.demandLevel} Demand
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatRevenue(venue.estimatedRevenue)}</div>
                    <div className="text-xs text-muted-foreground">{venue.bookingProbability}% booking probability</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            AI recommendations update every 15 seconds based on real-time market data
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
