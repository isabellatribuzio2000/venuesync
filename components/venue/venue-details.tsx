"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  Globe,
  Calendar,
  Clock,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  capacity: number
  venue_type: string
  contact_email: string
  website_url?: string
  phone?: string
  description?: string
  images?: string[]
  created_at: string
  updated_at: string
}

interface VenueDetailsProps {
  venue: Venue
}

export function VenueDetails({ venue }: VenueDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getVenueTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      arena: "Arena",
      theater: "Theater", 
      club: "Club",
      stadium: "Stadium",
      outdoor: "Outdoor Venue",
      convention_center: "Convention Center",
      restaurant: "Restaurant/Bar",
      other: "Other"
    }
    return types[type] || type
  }

  const getVenueTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      arena: "bg-blue-500",
      theater: "bg-purple-500",
      club: "bg-green-500",
      stadium: "bg-orange-500",
      outdoor: "bg-emerald-500",
      convention_center: "bg-indigo-500",
      restaurant: "bg-pink-500",
      other: "bg-gray-500"
    }
    return colors[type] || "bg-gray-500"
  }

  return (
    <div className="space-y-8">
      {/* Images */}
      {venue.images && venue.images.length > 0 && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="md:col-span-2">
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              {venue.images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${venue.name} ${index + 2}`}
                  className="w-full h-32 object-cover"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {venue.description && (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">About This Venue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{venue.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Venue Details */}
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Venue Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#10b981]" />
              <div>
                <p className="text-sm text-gray-400">Capacity</p>
                <p className="text-white font-semibold">{venue.capacity.toLocaleString()} people</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#10b981]" />
              <div>
                <p className="text-sm text-gray-400">Venue Type</p>
                <p className="text-white font-semibold">{getVenueTypeLabel(venue.venue_type)}</p>
              </div>
            </div>

            {venue.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white font-semibold">{venue.phone}</p>
                </div>
              </div>
            )}

            {venue.website_url && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-sm text-gray-400">Website</p>
                  <a 
                    href={venue.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#10b981] hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
