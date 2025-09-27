import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
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
  searchParams: SearchParams
}

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const supabase = await createClient()

  // Get filter values from search params
  const filters = {
    search: searchParams.search || "",
    genre: searchParams.genre || "",
    min_followers: searchParams.min_followers ? parseInt(searchParams.min_followers) : undefined,
    max_followers: searchParams.max_followers ? parseInt(searchParams.max_followers) : undefined,
    popularity: searchParams.popularity || "",
    page: searchParams.page ? parseInt(searchParams.page) : 1
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-white">Artists</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Discover talented artists for your venue
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2a2a2a] border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Refine your search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Loading text="Loading filters..." />}>
                  <ArtistFilters currentFilters={filters} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Artists List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<Loading text="Loading artists..." />}>
              <ArtistList filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
