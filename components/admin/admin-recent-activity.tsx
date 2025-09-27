"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Building2, 
  Music, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "user_registered" | "venue_created" | "artist_created" | "booking_created" | "booking_confirmed"
  user_id: string
  user_name: string
  description: string
  timestamp: string
  metadata?: any
}

export function AdminRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadRecentActivity()
  }, [])

  const loadRecentActivity = async () => {
    setLoading(true)
    try {
      // Get recent profiles (users)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent venues
      const { data: venues } = await supabase
        .from("venues")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent artists
      const { data: artists } = await supabase
        .from("artists")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Combine and format activities
      const allActivities: Activity[] = []

      profiles?.forEach(profile => {
        allActivities.push({
          id: `profile-${profile.id}`,
          type: "user_registered",
          user_id: profile.id,
          user_name: profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.email,
          description: `New ${profile.user_type} registered`,
          timestamp: profile.created_at
        })
      })

      venues?.forEach(venue => {
        allActivities.push({
          id: `venue-${venue.id}`,
          type: "venue_created",
          user_id: venue.id,
          user_name: venue.name,
          description: "New venue created",
          timestamp: venue.created_at
        })
      })

      artists?.forEach(artist => {
        allActivities.push({
          id: `artist-${artist.id}`,
          type: "artist_created",
          user_id: artist.id,
          user_name: artist.name,
          description: "New artist profile created",
          timestamp: artist.created_at
        })
      })

      bookings?.forEach(booking => {
        allActivities.push({
          id: `booking-${booking.id}`,
          type: booking.status === "confirmed" ? "booking_confirmed" : "booking_created",
          user_id: booking.id,
          user_name: `Booking #${booking.id.slice(0, 8)}`,
          description: booking.status === "confirmed" ? "Booking confirmed" : "New booking request",
          timestamp: booking.created_at
        })
      })

      // Sort by timestamp and take the most recent
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setActivities(allActivities.slice(0, 10))
    } catch (error) {
      console.error("Error loading recent activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered":
        return <User className="w-4 h-4 text-blue-400" />
      case "venue_created":
        return <Building2 className="w-4 h-4 text-purple-400" />
      case "artist_created":
        return <Music className="w-4 h-4 text-green-400" />
      case "booking_created":
        return <Calendar className="w-4 h-4 text-orange-400" />
      case "booking_confirmed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <Plus className="w-4 h-4 text-gray-400" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user_registered":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "venue_created":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "artist_created":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "booking_created":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "booking_confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
            <div className="flex-1">
              <div className="h-3 bg-gray-700 rounded animate-pulse mb-1" />
              <div className="h-2 bg-gray-700 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No recent activity</p>
        </div>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-white font-medium">{activity.user_name}</p>
                <Badge className={cn("text-xs", getActivityColor(activity.type))}>
                  {activity.type.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
