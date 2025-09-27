'use client'

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { VenueDetails } from "@/components/venue/venue-details"
import { VenueBookingForm } from "@/components/venue/venue-booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

interface VenuePageClientProps {
  params: {
    id: string
  }
}

export function VenuePageClient({ params }: VenuePageClientProps) {
  const { id } = params
  const [venue, setVenue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVenue() {
      const supabase = createClient()
      
      if (!supabase) {
        setError("Application is not properly configured")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("venues")
          .select("*")
          .eq("id", id)
          .single()

        if (error) {
          console.error("Error fetching venue:", error)
          setError("Failed to load venue data")
        } else {
          setVenue(data)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load venue data")
      } finally {
        setLoading(false)
      }
    }

    fetchVenue()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading venue...</p>
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Venue Not Found</h1>
          <p className="text-gray-400">
            {error || "The venue you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${venue.image_url || '/placeholder.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 flex items-end h-full p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {venue.venue_type}
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                {venue.location}
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">{venue.name}</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl">
              {venue.description || "Book this amazing venue for your next event."}
            </p>
            
            <div className="flex items-center gap-6">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Book Venue
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                <MapPin className="w-4 h-4 mr-2" />
                View Location
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Venue Details */}
            <VenueDetails venue={venue} />
            
            {/* Booking Form */}
            <VenueBookingForm venueId={venue.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Venue Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Capacity</span>
                  </div>
                  <span className="text-white font-semibold">
                    {venue.capacity?.toLocaleString() || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Type</span>
                  </div>
                  <span className="text-white font-semibold">
                    {venue.venue_type || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Rating</span>
                  </div>
                  <span className="text-white font-semibold">
                    {venue.rating || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{venue.address}</span>
                </div>
                
                {venue.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`tel:${venue.phone}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {venue.phone}
                    </a>
                  </div>
                )}
                
                {venue.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`mailto:${venue.email}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {venue.email}
                    </a>
                  </div>
                )}
                
                {venue.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a 
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            {venue.amenities && (
              <Card className="bg-[#2a2a2a] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
