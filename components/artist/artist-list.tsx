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
  Music, 
  Users, 
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Artist {
  id: string
  spotify_id?: string
  name: string
  followers: number
  genres: string[]
  popularity: number
  image_url?: string
  external_urls?: any
  created_at: string
  updated_at: string
}

interface ArtistFilters {
  search: string
  genre: string
  min_followers?: number
  max_followers?: number
  popularity: string
  page: number
}

interface ArtistListProps {
  filters: ArtistFilters
}

export function ArtistList({ filters }: ArtistListProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(filters.page)
  const [searchQuery, setSearchQuery] = useState(filters.search)
  const [sortBy, setSortBy] = useState("followers")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const router = useRouter()
  const supabase = createClient()
  const itemsPerPage = 12

  useEffect(() => {
    loadArtists()
  }, [filters, currentPage, sortBy, sortOrder])

  const loadArtists = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("artists")
        .select("*", { count: "exact" })

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,genres.cs.{${filters.search}}`)
      }
      if (filters.genre) {
        query = query.contains("genres", [filters.genre])
      }
      if (filters.min_followers) {
        query = query.gte("followers", filters.min_followers)
      }
      if (filters.max_followers) {
        query = query.lte("followers", filters.max_followers)
      }
      if (filters.popularity) {
        const popularityRange = filters.popularity.split("-")
        if (popularityRange.length === 2) {
          query = query.gte("popularity", parseInt(popularityRange[0]))
          query = query.lte("popularity", parseInt(popularityRange[1]))
        }
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setArtists(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error loading artists:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (filters.genre) params.set("genre", filters.genre)
    if (filters.min_followers) params.set("min_followers", filters.min_followers.toString())
    if (filters.max_followers) params.set("max_followers", filters.max_followers.toString())
    if (filters.popularity) params.set("popularity", filters.popularity)
    
    router.push(`/artists?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(window.location.search)
    params.set("page", page.toString())
    router.push(`/artists?${params.toString()}`)
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return "text-green-400"
    if (popularity >= 60) return "text-yellow-400"
    if (popularity >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getPopularityLabel = (popularity: number) => {
    if (popularity >= 80) return "Very Popular"
    if (popularity >= 60) return "Popular"
    if (popularity >= 40) return "Rising"
    return "Emerging"
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Artists</h2>
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
              placeholder="Search artists..."
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
              <SelectItem value="followers" className="text-white">Followers</SelectItem>
              <SelectItem value="popularity" className="text-white">Popularity</SelectItem>
              <SelectItem value="name" className="text-white">Name</SelectItem>
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
        Showing {artists.length} of {totalCount} artists
      </div>

      {/* Artists Grid */}
      {artists.length === 0 ? (
        <Card className="bg-[#2a2a2a] border-gray-800">
          <CardContent className="text-center py-12">
            <Music className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No artists found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card key={artist.id} className="bg-[#2a2a2a] border-gray-800 hover:border-gray-600 transition-colors">
              <div className="relative">
                {artist.image_url ? (
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <Music className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <Badge 
                  className={cn(
                    "absolute top-2 right-2 text-white",
                    getPopularityColor(artist.popularity)
                  )}
                >
                  {getPopularityLabel(artist.popularity)}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{artist.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {formatFollowers(artist.followers)} followers
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {artist.popularity}% popularity
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">4.8</span>
                    </div>
                  </div>

                  {artist.genres && artist.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {artist.genres.slice(0, 3).map((genre, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                        >
                          {genre}
                        </Badge>
                      ))}
                      {artist.genres.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-500/20 text-gray-400">
                          +{artist.genres.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => router.push(`/artists/${artist.id}`)}
                    className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                  >
                    View Profile
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
