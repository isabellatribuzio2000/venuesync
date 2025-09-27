"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Users, 
  Star,
  TrendingUp,
  Calendar
} from "lucide-react"

interface VenueRecommendation {
  id: string
  name: string
  city: string
  state: string
  capacity: number
  matchScore: number
  reasons: string[]
  estimatedRevenue: number
  bookingProbability: number
  image?: string
}

export function VenueRecommendationEngine() {
  const [recommendations, setRecommendations] = useState<VenueRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRecommendations([
        {
          id: "1",
          name: "The Grand Theater",
          city: "New York",
          state: "NY",
          capacity: 2500,
          matchScore: 94,
          reasons: ["Perfect capacity match", "High fan density", "Great acoustics"],
          estimatedRevenue: 45000,
          bookingProbability: 87
        },
        {
          id: "2", 
          name: "Electric Ballroom",
          city: "Los Angeles",
          state: "CA",
          capacity: 1800,
          matchScore: 89,
          reasons: ["Trending venue", "Strong social media presence", "Artist-friendly"],
          estimatedRevenue: 38000,
          bookingProbability: 82
        },
        {
          id: "3",
          name: "Crystal Palace",
          city: "Chicago",
          state: "IL", 
          capacity: 3200,
          matchScore: 85,
          reasons: ["Excellent location", "Premium amenities", "High conversion rate"],
          estimatedRevenue: 52000,
          bookingProbability: 78
        },
        {
          id: "4",
          name: "Sunset Arena",
          city: "Miami",
          state: "FL",
          capacity: 2200,
          matchScore: 82,
          reasons: ["Growing market", "Tourist destination", "Good weather"],
          estimatedRevenue: 41000,
          bookingProbability: 75
        }
      ])
      setLoading(false)
    }

    loadRecommendations()
  }, [])

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (score >= 80) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    return "bg-orange-500/20 text-orange-400 border-orange-500/30"
  }

  if (loading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Venue Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#10b981]" />
          Venue Recommendations
        </CardTitle>
        <CardDescription className="text-gray-400">
          AI-powered venue matching for your next tour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((venue) => (
            <div key={venue.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{venue.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.city}, {venue.state}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getMatchColor(venue.matchScore)}>
                    {venue.matchScore}% match
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded mx-auto mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm text-white font-semibold">{venue.capacity.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Capacity</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded mx-auto mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-sm text-white font-semibold">${venue.estimatedRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Est. Revenue</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded mx-auto mb-1">
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-sm text-white font-semibold">{venue.bookingProbability}%</p>
                  <p className="text-xs text-gray-400">Booking Chance</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded mx-auto mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-sm text-white font-semibold">4.8</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-sm text-gray-300 mb-2">Why this venue matches:</h4>
                <div className="flex flex-wrap gap-2">
                  {venue.reasons.map((reason, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Contact Venue
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}