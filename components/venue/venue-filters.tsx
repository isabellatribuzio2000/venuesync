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

interface VenueFiltersProps {
  currentFilters: {
    search: string
    city: string
    state: string
    venue_type: string
    min_capacity?: number
    max_capacity?: number
    page: number
  }
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

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
]

export function VenueFilters({ currentFilters }: VenueFiltersProps) {
  const [filters, setFilters] = useState(currentFilters)
  const [capacityRange, setCapacityRange] = useState([
    currentFilters.min_capacity || 0,
    currentFilters.max_capacity || 10000
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
    
    // Add capacity range
    if (capacityRange[0] > 0) params.set("min_capacity", capacityRange[0].toString())
    if (capacityRange[1] < 10000) params.set("max_capacity", capacityRange[1].toString())
    
    router.push(`/venues?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      state: "",
      venue_type: "",
      min_capacity: undefined,
      max_capacity: undefined,
      page: 1
    })
    setCapacityRange([0, 10000])
    router.push("/venues")
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== "" && value !== 1
  ) || capacityRange[0] > 0 || capacityRange[1] < 10000

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-gray-300">Search</Label>
        <Input
          id="search"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search venues..."
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Location</h3>
        
        <div className="space-y-2">
          <Label htmlFor="city" className="text-gray-300">City</Label>
          <Input
            id="city"
            value={filters.city}
            onChange={(e) => updateFilter("city", e.target.value)}
            placeholder="Enter city"
            className="bg-[#1a1a1a] border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-gray-300">State</Label>
          <Select value={filters.state} onValueChange={(value) => updateFilter("state", value)}>
            <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700">
              {STATES.map((state) => (
                <SelectItem key={state} value={state} className="text-white">
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Venue Type */}
      <div className="space-y-2">
        <Label htmlFor="venue_type" className="text-gray-300">Venue Type</Label>
        <Select value={filters.venue_type} onValueChange={(value) => updateFilter("venue_type", value)}>
          <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2a] border-gray-700">
            {VENUE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-white">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Capacity Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Capacity Range</Label>
          <div className="text-sm text-gray-400">
            {capacityRange[0].toLocaleString()} - {capacityRange[1].toLocaleString()}
          </div>
        </div>
        
        <Slider
          value={capacityRange}
          onValueChange={setCapacityRange}
          max={10000}
          min={0}
          step={100}
          className="w-full"
        />
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>0</span>
          <span>10,000+</span>
        </div>
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
            {filters.city && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                City: {filters.city}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("city", "")}
                />
              </Badge>
            )}
            {filters.state && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                State: {filters.state}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("state", "")}
                />
              </Badge>
            )}
            {filters.venue_type && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Type: {VENUE_TYPES.find(t => t.value === filters.venue_type)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("venue_type", "")}
                />
              </Badge>
            )}
            {(capacityRange[0] > 0 || capacityRange[1] < 10000) && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Capacity: {capacityRange[0].toLocaleString()}-{capacityRange[1].toLocaleString()}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setCapacityRange([0, 10000])}
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
