import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
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

interface VenuePageProps {
  params: {
    id: string
  }
}

export default async function VenuePage({ params }: VenuePageProps) {
  const supabase = await createClient()
  const { id } = params

  // Get venue data
  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !venue) {
    notFound()
  }

  // Get user profile to check if they can book
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single() : { data: null }

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
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-[#10b981]" />
                <h1 className="text-3xl font-bold text-white">{venue.name}</h1>
                <Badge 
                  className={cn(
                    "text-white",
                    getVenueTypeColor(venue.venue_type)
                  )}
                >
                  {getVenueTypeLabel(venue.venue_type)}
                </Badge>
              </div>
              <div className="flex items-center text-gray-400 mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{venue.address}, {venue.city}, {venue.state} {venue.zip}</span>
              </div>
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{venue.capacity.toLocaleString()} capacity</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                  <span>4.5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
                    {venue.images.slice(1, 5).map((image: string, index: number) => (
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#10b981]" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a 
                      href={`mailto:${venue.contact_email}`}
                      className="text-[#10b981] hover:underline"
                    >
                      {venue.contact_email}
                    </a>
                  </div>
                </div>
                
                {venue.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a 
                        href={`tel:${venue.phone}`}
                        className="text-[#10b981] hover:underline"
                      >
                        {venue.phone}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Form */}
            {user && profile?.user_type === "artist" && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Request Booking
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Send a booking request to this venue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VenueBookingForm venueId={venue.id} />
                </CardContent>
              </Card>
            )}

            {/* Login Prompt for Non-Artists */}
            {!user && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Want to Book This Venue?</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in as an artist to request bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => window.location.href = "/auth/login"}
                    className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                  >
                    Sign In to Book
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Venue Manager Actions */}
            {user && profile?.user_type === "venue" && (
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Manage Venue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => window.location.href = `/venues/${venue.id}/edit`}
                    className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                  >
                    Edit Venue
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = "/dashboard/venue"}
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
