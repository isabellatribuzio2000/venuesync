'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArtistList } from "@/components/artist/artist-list"
import { ArtistFilters } from "@/components/artist/artist-filters"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Search, Filter } from "lucide-react"

interface SearchParams {
  search?: string
  genre?: string
  min_followers?: string
  max_followers?: string
  popularity?: string
  page?: string
}

interface ArtistsPageProps {
  searchParams?: SearchParams
}

export default function ArtistsPage({ searchParams = {} }: ArtistsPageProps) {
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

      // No authentication required for public artists page
      setLoading(false)
    }

    initialize()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading artists...</p>
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
    genre: searchParams.genre || "",
    min_followers: searchParams.min_followers ? parseInt(searchParams.min_followers) : undefined,
    max_followers: searchParams.max_followers ? parseInt(searchParams.max_followers) : undefined,
    popularity: searchParams.popularity || "",
    page: parseInt(searchParams.page || "1")
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Artists</h1>
          <p className="text-gray-400">Discover talented artists for your venue</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ArtistFilters currentFilters={filters} />
        </div>

        {/* Artists List */}
        <div className="space-y-6">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Music className="w-5 h-5 mr-2" />
                All Artists
              </CardTitle>
              <CardDescription className="text-gray-400">
                Browse and discover artists that match your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArtistList filters={filters} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}