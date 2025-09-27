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
  Building2, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  Globe,
  Search,
  ChevronLeft,
  ChevronRight,
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

interface VenueFilters {
  search: string
  city: string
  state: string
  venue_type: string
  min_capacity?: number
  max_capacity?: number
  page: number
}

interface VenueListProps {
  filters: VenueFilters
}

const VENUE_TYPES = [
  { value: "arena", label: "Arena" },
  { value: "theater", label: "Theater" },
  { value: "club", label: "Club" },
  { value: "stadium", label: "Stadium" },
  { value: "outdoor", label: "Outdoor Venue" },
  { value: "convention_center", label: "Convention Center" },
  { value: "restaurant", label: "Restaurant/Bar" },
  { value: "other", label: "Other" }
]

export function VenueList({ filters }: VenueListProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(filters.page)
  const [searchQuery, setSearchQuery] = useState(filters.search)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const router = useRouter()
  const supabase = createClient()
  const itemsPerPage = 12

  useEffect(() => {
    loadVenues()
  }, [filters, currentPage, sortBy, sortOrder])

  const loadVenues = async () => {
    setLoading(true)
    try {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      let query = supabase
        .from("venues")
        .select("*", { count: "exact" })

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,state.ilike.%${filters.search}%`)
      }
      if (filters.city) {
        query = query.eq("city", filters.city)
      }
      if (filters.state) {
        query = query.eq("state", filters.state)
      }
      if (filters.venue_type) {
        query = query.eq("venue_type", filters.venue_type)
      }
      if (filters.min_capacity) {
        query = query.gte("capacity", filters.min_capacity)
      }
      if (filters.max_capacity) {
        query = query.lte("capacity", filters.max_capacity)
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setVenues(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error loading venues:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (filters.city) params.set("city", filters.city)
    if (filters.state) params.set("state", filters.state)
    if (filters.venue_type) params.set("venue_type", filters.venue_type)
    if (filters.min_capacity) params.set("min_capacity", filters.min_capacity.toString())
    if (filters.max_capacity) params.set("max_capacity", filters.max_capacity.toString())
    
    router.push(`/venues?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(window.location.search)
    params.set("page", page.toString())
    router.push(`/venues?${params.toString()}`)
  }

  const getVenueTypeLabel = (type: string) => {
    return VENUE_TYPES.find(t => t.value === type)?.label || type
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

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Venues</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[#2a2a2a] border-gray-800">
              <div className="h-48 bg-gray-700 animate-pulse rounded-t-lg" />
              <CardContent className="p-4">
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
              placeholder="Search venues..."
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
              <SelectItem value="name" className="text-white">Name</SelectItem>
              <SelectItem value="capacity" className="text-white">Capacity</SelectItem>
              <SelectItem value="created_at" className="text-white">Date Added</SelectItem>
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
        Showing {venues.length} of {totalCount} venues
      </div>

      {/* Venues Grid */}
      {venues.length === 0 ? (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No venues found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="bg-[#2a2a2a] border-gray-800 hover:border-gray-600 transition-colors">
              <div className="relative">
                {venue.images && venue.images.length > 0 ? (
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <Badge 
                  className={cn(
                    "absolute top-2 right-2 text-white",
                    getVenueTypeColor(venue.venue_type)
                  )}
                >
                  {getVenueTypeLabel(venue.venue_type)}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{venue.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {venue.city}, {venue.state}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {venue.capacity.toLocaleString()} capacity
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">4.5</span>
                    </div>
                  </div>

                  {venue.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {venue.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {venue.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {venue.phone}
                      </div>
                    )}
                    {venue.website_url && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => router.push(`/venues/${venue.id}`)}
                    className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
