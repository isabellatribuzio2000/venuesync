'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { VenueList } from "@/components/venue/venue-list"
import { VenueFilters } from "@/components/venue/venue-filters"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Search, Filter } from "lucide-react"

interface SearchParams {
  search?: string
  city?: string
  state?: string
  venue_type?: string
  min_capacity?: string
  max_capacity?: string
  page?: string
}

interface VenuesPageProps {
  searchParams?: SearchParams
}

export default function VenuesPage({ searchParams = {} }: VenuesPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initialize() {
      const supabase = createClient()
      
      if (!supabase) {
        setError("Application is not properly configured")
        setLoading(false)
        return
      }

      // No authentication required for public venues page
      setLoading(false)
    }

    initialize()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading venues...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Configuration Required</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  // Get filter values from search params
  const filters = {
    search: searchParams.search || "",
    city: searchParams.city || "",
    state: searchParams.state || "",
    venue_type: searchParams.venue_type || "",
    min_capacity: searchParams.min_capacity ? parseInt(searchParams.min_capacity) : undefined,
    max_capacity: searchParams.max_capacity ? parseInt(searchParams.max_capacity) : undefined,
    page: parseInt(searchParams.page || "1")
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Venues</h1>
          <p className="text-gray-400">Discover amazing venues for your next event</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <VenueFilters currentFilters={filters} />
        </div>

        {/* Venues List */}
        <div className="space-y-6">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                All Venues
              </CardTitle>
              <CardDescription className="text-gray-400">
                Browse and discover venues that match your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VenueList filters={filters} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}