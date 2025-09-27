import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Music, 
  Calendar, 
  Users, 
  TrendingUp,
  MapPin,
  Plus,
  Settings,
  BarChart3,
  Star
} from "lucide-react"
import Link from "next/link"

export default async function ArtistDashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile || profile.user_type !== "artist") {
    redirect("/dashboard")
  }

  // Get artist data
  const { data: artist } = await supabase.from("artists").select("*").eq("user_id", data.user.id).single()
  const { data: bookings } = await supabase.from("bookings").select("*").eq("artist_id", artist?.id).limit(5)
  const { data: stats } = await supabase.from("bookings").select("status").eq("artist_id", artist?.id)

  const confirmedBookings = stats?.filter(s => s.status === "confirmed").length || 0
  const pendingBookings = stats?.filter(s => s.status === "pending").length || 0

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Artist Dashboard</h1>
              <p className="text-gray-400">Manage your music career and bookings</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/artists/new">
                <Button className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
              <Link href="/dashboard/artist/settings">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Artist Profile Card */}
        {artist && (
          <Card className="bg-[#2a2a2a] border-gray-800 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {artist.image_url && (
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{artist.name}</h2>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{artist.followers?.toLocaleString() || 0} followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{artist.popularity || 0}% popularity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>4.8 rating</span>
                    </div>
                  </div>
                  {artist.genres && artist.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {artist.genres.slice(0, 3).map((genre, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-2xl font-bold text-white">{pendingBookings}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Followers</p>
                  <p className="text-2xl font-bold text-white">{artist?.followers?.toLocaleString() || 0}</p>
                </div>
                <Users className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Popularity</p>
                  <p className="text-2xl font-bold text-white">{artist?.popularity || 0}%</p>
                </div>
                <Star className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest booking requests
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
                  <p className="text-gray-400 mb-4">No bookings yet</p>
                  <Link href="/venues">
                    <Button className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                      <MapPin className="w-4 h-4 mr-2" />
                      Find Venues
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/venues">
                  <Button className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Venues
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Button>
                </Link>
                <Link href="/dashboard/artist/analytics">
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