import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LiveStreamingData } from "@/components/analytics/live-streaming-data"
import { FanLocationHeatMap } from "@/components/analytics/fan-location-heat-map"
import { VenueRecommendationEngine } from "@/components/analytics/venue-recommendation-engine"
import { BookingConversionMetrics } from "@/components/analytics/booking-conversion-metrics"
import { AnalyticsRevenueProjections } from "@/components/analytics/analytics-revenue-projections"

export default async function AnalyticsDashboard() {
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

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Live Data */}
          <div className="xl:col-span-1 space-y-6">
            <LiveStreamingData />
            <BookingConversionMetrics />
          </div>

          {/* Middle Column - Heat Map & Recommendations */}
          <div className="xl:col-span-1 space-y-6">
            <FanLocationHeatMap />
            <VenueRecommendationEngine />
          </div>

          {/* Right Column - Revenue Projections */}
          <div className="xl:col-span-1 space-y-6">
            <AnalyticsRevenueProjections />
          </div>
        </div>
      </main>
    </div>
  )
}
