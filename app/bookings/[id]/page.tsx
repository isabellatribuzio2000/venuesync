import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
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

interface BookingPageProps {
  params: {
    id: string
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const supabase = await createClient()
  const { id } = params

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get booking data with related information
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      artist:artists(id, name, image_url, followers, popularity),
      venue:venues(id, name, city, state, capacity)
    `)
    .eq("id", id)
    .single()

  if (error || !booking) {
    notFound()
  }

  // Check if user has access to this booking
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Check if user is authorized to view this booking
  const isAuthorized = booking.user_id === user.id || 
    (profile.user_type === "admin") ||
    (profile.user_type === "venue_manager" && booking.venue_id) ||
    (profile.user_type === "artist" && booking.artist_id)

  if (!isAuthorized) {
    redirect("/bookings")
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      cancelled: "bg-red-500",
      completed: "bg-blue-500"
    }
    return colors[status] || "bg-gray-500"
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: AlertCircle,
      confirmed: CheckCircle,
      cancelled: XCircle,
      completed: CheckCircle
    }
    return icons[status] || AlertCircle
  }

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

  const StatusIcon = getStatusIcon(booking.status)

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-[#10b981]" />
                <h1 className="text-3xl font-bold text-white">Booking Details</h1>
                <Badge 
                  className={cn(
                    "text-white",
                    getStatusColor(booking.status)
                  )}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(booking.event_date)}</span>
                  {booking.event_time && (
                    <>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTime(booking.event_time)}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <StatusIcon className={cn("w-5 h-5 mr-2", getStatusColor(booking.status))} />
                  <span>Status: {booking.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Information */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {booking.notes && (
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Additional Notes</h4>
                    <p className="text-gray-300">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Information */}
            {(booking.offer_amount || booking.ticket_price_min || booking.ticket_price_max) && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Financial Information</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            {/* Booking Details */}
            <BookingDetails booking={booking} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <BookingActions booking={booking} userType={profile.user_type} />

            {/* Artist Information */}
            {booking.artist && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Artist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    {booking.artist.image_url && (
                      <img
                        src={booking.artist.image_url}
                        alt={booking.artist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-semibold">{booking.artist.name}</p>
                      <p className="text-sm text-gray-400">
                        {booking.artist.followers?.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Venue Information */}
            {booking.venue && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Venue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-white font-semibold">{booking.venue.name}</p>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.venue.city}, {booking.venue.state}
                    </div>
                    {booking.venue.capacity && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.venue.capacity.toLocaleString()} capacity
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                  <div>
                    <p className="text-sm text-white">Booking Created</p>
                    <p className="text-xs text-gray-400">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {booking.status !== "pending" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                    <div>
                      <p className="text-sm text-white">Status Updated</p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.updated_at).toLocaleDateString()}
                      </p>
                    </div>
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
