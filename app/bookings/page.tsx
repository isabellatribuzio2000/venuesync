import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookingList } from "@/components/booking/booking-list"
import { BookingFilters } from "@/components/booking/booking-filters"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Search, Filter } from "lucide-react"

interface SearchParams {
  status?: string
  event_date_from?: string
  event_date_to?: string
  page?: string
}

interface BookingsPageProps {
  searchParams: SearchParams
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Configuration Required</h1>
          <p className="text-gray-400">
            Application is not properly configured for this environment.
          </p>
        </div>
      </div>
    )
  }

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get filter values from search params
  const filters = {
    status: searchParams.status || "",
    event_date_from: searchParams.event_date_from || "",
    event_date_to: searchParams.event_date_to || "",
    page: searchParams.page ? parseInt(searchParams.page) : 1
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-white">Bookings</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {profile.user_type === "artist" 
              ? "Manage your booking requests and opportunities"
              : "Manage venue bookings and artist requests"
            }
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
                  <BookingFilters currentFilters={filters} userType={profile.user_type} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<Loading text="Loading bookings..." />}>
              <BookingList filters={filters} userType={profile.user_type} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
