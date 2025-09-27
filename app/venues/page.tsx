import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
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
  searchParams: SearchParams
}

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const supabase = await createClient()

  // Get filter values from search params
  const filters = {
    search: searchParams.search || "",
    city: searchParams.city || "",
    state: searchParams.state || "",
    venue_type: searchParams.venue_type || "",
    min_capacity: searchParams.min_capacity ? parseInt(searchParams.min_capacity) : undefined,
    max_capacity: searchParams.max_capacity ? parseInt(searchParams.max_capacity) : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-white">Venues</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Discover amazing venues for your next event
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
                  <VenueFilters currentFilters={filters} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Venues List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<Loading text="Loading venues..." />}>
              <VenueList filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
