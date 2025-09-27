"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Music,
  Building2,
  User,
  Mail,
  Phone
} from "lucide-react"

interface Booking {
  id: string
  artist_id?: string
  venue_id?: string
  user_id: string
  event_date: string
  event_time?: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  ticket_price_min?: number
  ticket_price_max?: number
  expected_attendance?: number
  offer_amount?: number
  event_type?: string
  notes?: string
  created_at: string
  updated_at: string
  artist?: {
    id: string
    name: string
    image_url?: string
    followers?: number
    popularity?: number
  }
  venue?: {
    id: string
    name: string
    city: string
    state: string
    capacity?: number
  }
}

interface BookingDetailsProps {
  booking: Booking
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Booking Details</CardTitle>
        <CardDescription className="text-gray-400">
          Complete information about this booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Event Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#10b981]" />
              <div>
                <p className="text-sm text-gray-400">Event Date</p>
                <p className="text-white font-semibold">{formatDate(booking.event_date)}</p>
              </div>
            </div>
            
            {booking.event_time && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-sm text-gray-400">Event Time</p>
                  <p className="text-white font-semibold">{formatTime(booking.event_time)}</p>
                </div>
              </div>
            )}

            {booking.event_type && (
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-sm text-gray-400">Event Type</p>
                  <p className="text-white font-semibold">{booking.event_type}</p>
                </div>
              </div>
            )}

            {booking.expected_attendance && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-sm text-gray-400">Expected Attendance</p>
                  <p className="text-white font-semibold">{booking.expected_attendance.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information */}
        {(booking.offer_amount || booking.ticket_price_min || booking.ticket_price_max) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {booking.offer_amount && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#10b981]" />
                  <div>
                    <p className="text-sm text-gray-400">Offer Amount</p>
                    <p className="text-white font-semibold">${booking.offer_amount.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {booking.ticket_price_min && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#10b981]" />
                  <div>
                    <p className="text-sm text-gray-400">Min Ticket Price</p>
                    <p className="text-white font-semibold">${booking.ticket_price_min.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {booking.ticket_price_max && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#10b981]" />
                  <div>
                    <p className="text-sm text-gray-400">Max Ticket Price</p>
                    <p className="text-white font-semibold">${booking.ticket_price_max.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Artist Information */}
        {booking.artist && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Artist Information</h3>
            <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg">
              {booking.artist.image_url && (
                <img
                  src={booking.artist.image_url}
                  alt={booking.artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold">{booking.artist.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  {booking.artist.followers && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{booking.artist.followers.toLocaleString()} followers</span>
                    </div>
                  )}
                  {booking.artist.popularity && (
                    <div className="flex items-center gap-1">
                      <span>{booking.artist.popularity}% popularity</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Venue Information */}
        {booking.venue && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Venue Information</h3>
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-[#10b981]" />
                <h4 className="text-white font-semibold">{booking.venue.name}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.venue.city}, {booking.venue.state}</span>
                </div>
                {booking.venue.capacity && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{booking.venue.capacity.toLocaleString()} capacity</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {booking.notes && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Additional Notes</h3>
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <p className="text-gray-300">{booking.notes}</p>
            </div>
          </div>
        )}

        {/* Booking Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Booking Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#10b981] rounded-full" />
              <div>
                <p className="text-sm text-white">Booking Created</p>
                <p className="text-xs text-gray-400">
                  {new Date(booking.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            {booking.status !== "pending" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                <div>
                  <p className="text-sm text-white">Status Updated to {booking.status}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(booking.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
