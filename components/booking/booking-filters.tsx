"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface BookingFiltersProps {
  currentFilters: {
    status: string
    event_date_from: string
    event_date_to: string
    page: number
  }
  userType: string
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" }
]

export function BookingFilters({ currentFilters, userType }: BookingFiltersProps) {
  const [filters, setFilters] = useState(currentFilters)
  const router = useRouter()

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString())
      }
    })
    
    router.push(`/bookings?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      status: "",
      event_date_from: "",
      event_date_to: "",
      page: 1
    })
    router.push("/bookings")
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== "" && value !== 1
  )

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-gray-300">Status</Label>
        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2a] border-gray-700">
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value} className="text-white">
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Event Date Range</h3>
        
        <div className="space-y-2">
          <Label htmlFor="event_date_from" className="text-gray-300">From Date</Label>
          <Input
            id="event_date_from"
            type="date"
            value={filters.event_date_from}
            onChange={(e) => updateFilter("event_date_from", e.target.value)}
            className="bg-[#1a1a1a] border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date_to" className="text-gray-300">To Date</Label>
          <Input
            id="event_date_to"
            type="date"
            value={filters.event_date_to}
            onChange={(e) => updateFilter("event_date_to", e.target.value)}
            className="bg-[#1a1a1a] border-gray-700 text-white"
          />
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
            {filters.status && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("status", "")}
                />
              </Badge>
            )}
            {filters.event_date_from && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                From: {new Date(filters.event_date_from).toLocaleDateString()}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("event_date_from", "")}
                />
              </Badge>
            )}
            {filters.event_date_to && (
              <Badge variant="secondary" className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                To: {new Date(filters.event_date_to).toLocaleDateString()}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter("event_date_to", "")}
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
