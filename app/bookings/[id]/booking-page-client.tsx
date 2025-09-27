'use client'

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { BookingDetails } from "@/components/booking/booking-details"
import { BookingActions } from "@/components/booking/booking-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Music,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingPageClientProps {
  params: {
    id: string
  }
}

export function BookingPageClient({ params }: BookingPageClientProps) {
  const { id } = params
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      const supabase = createClient()
      
      if (!supabase) {
        setError("Application is not properly configured")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            artist:artists(*),
            venue:venues(*)
          `)
          .eq("id", id)
          .single()

        if (error) {
          console.error("Error fetching booking:", error)
          setError("Failed to load booking data")
        } else {
          setBooking(data)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load booking data")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading booking...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Booking Not Found</h1>
          <p className="text-gray-400">
            {error || "The booking you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600'
      case 'pending':
        return 'bg-yellow-600'
      case 'cancelled':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-[#2a2a2a] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
              <p className="text-gray-400">Booking ID: {booking.id}</p>
            </div>
            <Badge 
              className={cn("text-white", getStatusColor(booking.status))}
            >
              {getStatusIcon(booking.status)}
              <span className="ml-2 capitalize">{booking.status}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <BookingDetails booking={booking} />
            
            {/* Booking Actions */}
            <BookingActions booking={booking} userType="artist" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Date</p>
                    <p className="text-white font-semibold">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Time</p>
                    <p className="text-white font-semibold">
                      {new Date(booking.event_date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Total Amount</p>
                    <p className="text-white font-semibold">
                      ${booking.total_amount?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artist Info */}
            {booking.artist && (
              <Card className="bg-[#2a2a2a] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Artist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Music className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">{booking.artist.name}</p>
                      <p className="text-gray-400 text-sm">{booking.artist.genre}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Venue Info */}
            {booking.venue && (
              <Card className="bg-[#2a2a2a] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">{booking.venue.name}</p>
                      <p className="text-gray-400 text-sm">{booking.venue.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{booking.venue?.address || "N/A"}</span>
                </div>
                
                {booking.contact_email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Email:</span>
                    <a 
                      href={`mailto:${booking.contact_email}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {booking.contact_email}
                    </a>
                  </div>
                )}
                
                {booking.contact_phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Phone:</span>
                    <a 
                      href={`tel:${booking.contact_phone}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {booking.contact_phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
