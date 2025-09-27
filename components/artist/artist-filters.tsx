"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ArtistFiltersProps {
  currentFilters: {
    search: string
    genre: string
    min_followers?: number
    max_followers?: number
    popularity: string
    page: number
  }
}

const GENRES = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Electronic", "Jazz", "Classical", "Country",
  "Folk", "Blues", "Reggae", "Punk", "Metal", "Indie", "Alternative", "Funk",
  "Soul", "Gospel", "Latin", "World", "Ambient", "Experimental"
]

const POPULARITY_RANGES = [
  { value: "0-20", label: "Emerging (0-20%)" },
  { value: "20-40", label: "Rising (20-40%)" },
  { value: "40-60", label: "Popular (40-60%)" },
  { value: "60-80", label: "Very Popular (60-80%)" },
  { value: "80-100", label: "Superstar (80-100%)" }
]

export function ArtistFilters({ currentFilters }: ArtistFiltersProps) {
  const [filters, setFilters] = useState(currentFilters)
  const [followersRange, setFollowersRange] = useState([
    currentFilters.min_followers || 0,
    currentFilters.max_followers || 10000000
  ])
  
  const router = useRouter()

  const updateFilter = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString())
      }
    })
    
    // Add followers range
    if (followersRange[0] > 0) params.set("min_followers", followersRange[0].toString())
    if (followersRange[1] < 10000000) params.set("max_followers", followersRange[1].toString())
    
    router.push(`/artists?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      genre: "",
      min_followers: undefined,
      max_followers: undefined,
      popularity: "",
      page: 1
    })
    setFollowersRange([0, 10000000])
    router.push("/artists")
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== "" && value !== 1
  ) || followersRange[0] > 0 || followersRange[1] < 10000000

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-gray-300">Search</Label>
        <Input
          id="search"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search artists..."
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
      </div>

      {/* Genre */}
      <div className="space-y-2">
        <Label htmlFor="genre" className="text-gray-300">Genre</Label>
        <Select value={filters.genre} onValueChange={(value) => updateFilter("genre", value)}>
          <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
            <SelectValue placeholder="All genres" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2a] border-gray-700">
            {GENRES.map((genre) => (
              <SelectItem key={genre} value={genre} className="text-white">
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Followers Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Followers Range</Label>
          <div className="text-sm text-gray-400">
            {formatFollowers(followersRange[0])} - {formatFollowers(followersRange[1])}
          </div>
        </div>
        
        <Slider
          value={followersRange}
          onValueChange={setFollowersRange}
          max={10000000}
          min={0}
          step={10000}
          className="w-full"
        />
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>0</span>
          <span>10M+</span>
        </div>
      </div>

      {/* Popularity */}
      <div className="space-y-2">
        <Label htmlFor="popularity" className="text-gray-300">Popularity</Label>
        <Select value={filters.popularity} onValueChange={(value) => updateFilter("popularity", value)}>
          <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
            <SelectValue placeholder="All popularity levels" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2a] border-gray-700">
            {POPULARITY_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value} className="text-white">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Active Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              Clear All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Search: {filters.search}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("search", "")}
                />
              </Badge>
            )}
            {filters.genre && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Genre: {filters.genre}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("genre", "")}
                />
              </Badge>
            )}
            {filters.popularity && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Popularity: {POPULARITY_RANGES.find(r => r.value === filters.popularity)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("popularity", "")}
                />
              </Badge>
            )}
            {(followersRange[0] > 0 || followersRange[1] < 10000000) && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Followers: {formatFollowers(followersRange[0])}-{formatFollowers(followersRange[1])}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setFollowersRange([0, 10000000])}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Apply Filters Button */}
      <Button
        onClick={applyFilters}
        className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
      >
        Apply Filters
      </Button>
    </div>
  )
}
