import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp,
  MapPin,
  Plus,
  Settings,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default async function VenueDashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile || profile.user_type !== "venue") {
    redirect("/dashboard")
  }

  // Get venue data
  const { data: venues } = await supabase.from("venues").select("*").limit(5)
  const { data: bookings } = await supabase.from("bookings").select("*").limit(5)
  const { data: stats } = await supabase.from("bookings").select("status").eq("status", "confirmed")

  const confirmedBookings = stats?.length || 0

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Venue Dashboard</h1>
              <p className="text-gray-400">Manage your venues and bookings</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/venues/new">
                <Button className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Venue
                </Button>
              </Link>
              <Link href="/dashboard/venue/settings">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Venues</p>
                  <p className="text-2xl font-bold text-white">{venues?.length || 0}</p>
                </div>
                <Building2 className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Confirmed Bookings</p>
                  <p className="text-2xl font-bold text-white">{confirmedBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Requests</p>
                  <p className="text-2xl font-bold text-white">{bookings?.filter(b => b.status === "pending").length || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Capacity</p>
                  <p className="text-2xl font-bold text-white">
                    {venues?.reduce((sum, venue) => sum + (venue.capacity || 0), 0).toLocaleString() || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Venues */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                My Venues
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your venue listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {venues && venues.length > 0 ? (
                <div className="space-y-4">
                  {venues.map((venue) => (
                    <div key={venue.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{venue.name}</h3>
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {venue.city}, {venue.state}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                          {venue.capacity?.toLocaleString()} capacity
                        </Badge>
                        <Link href={`/venues/${venue.id}/edit`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No venues yet</p>
                  <Link href="/venues/new">
                    <Button className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Venue
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Latest booking requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <h3 className="text-white font-semibold">Booking Request</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(booking.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            booking.status === "confirmed" 
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Link href={`/bookings/${booking.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No bookings yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/venues/new">
                  <Button className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Venue
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Button>
                </Link>
                <Link href="/dashboard/venue/analytics">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}