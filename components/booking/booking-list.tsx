"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  }
  venue?: {
    id: string
    name: string
    city: string
    state: string
  }
}

interface BookingFilters {
  status: string
  event_date_from: string
  event_date_to: string
  page: number
}

interface BookingListProps {
  filters: BookingFilters
  userType: string
}

export function BookingList({ filters, userType }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(filters.page)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const router = useRouter()
  const supabase = createClient()
  const itemsPerPage = 10

  useEffect(() => {
    loadBookings()
  }, [filters, currentPage, sortBy, sortOrder])

  const loadBookings = async () => {
    setLoading(true)
    try {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      let query = supabase
        .from("bookings")
        .select(`
          *,
          artist:artists(id, name, image_url),
          venue:venues(id, name, city, state)
        `, { count: "exact" })

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status)
      }
      if (filters.event_date_from) {
        query = query.gte("event_date", filters.event_date_from)
      }
      if (filters.event_date_to) {
        query = query.lte("event_date", filters.event_date_to)
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setBookings(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error loading bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(window.location.search)
    params.set("page", page.toString())
    router.push(`/bookings?${params.toString()}`)
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
      month: 'short',
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

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Bookings</h2>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-[#2a2a2a] border-gray-800">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700">
              <SelectItem value="created_at" className="text-white">Date Created</SelectItem>
              <SelectItem value="event_date" className="text-white">Event Date</SelectItem>
              <SelectItem value="status" className="text-white">Status</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-400">
        Showing {bookings.length} of {totalCount} bookings
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const StatusIcon = getStatusIcon(booking.status)
            
            return (
              <Card key={booking.id} className="bg-[#2a2a2a] border-gray-800 hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <StatusIcon className={cn("w-5 h-5", getStatusColor(booking.status))} />
                        <Badge 
                          className={cn("text-white", getStatusColor(booking.status))}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          Created {formatDate(booking.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {formatDate(booking.event_date)}
                              {booking.event_time && ` at ${formatTime(booking.event_time)}`}
                            </span>
                          </div>
                          
                          {booking.artist && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">Artist: {booking.artist.name}</span>
                            </div>
                          )}
                          
                          {booking.venue && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">Venue: {booking.venue.name}, {booking.venue.city}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {booking.expected_attendance && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{booking.expected_attendance.toLocaleString()} expected</span>
                            </div>
                          )}
                          
                          {booking.offer_amount && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm">${booking.offer_amount.toLocaleString()}</span>
                            </div>
                          )}
                          
                          {booking.event_type && (
                            <div className="text-sm text-gray-400">
                              {booking.event_type}
                            </div>
                          )}
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="text-sm text-gray-300">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    currentPage === page
                      ? "bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                      : "border-gray-700 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {page}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
