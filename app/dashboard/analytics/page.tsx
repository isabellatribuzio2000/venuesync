'use client'

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LiveStreamingData } from "@/components/analytics/live-streaming-data"
import { FanLocationHeatMap } from "@/components/analytics/fan-location-heat-map"
import { VenueRecommendationEngine } from "@/components/analytics/venue-recommendation-engine"
import { BookingConversionMetrics } from "@/components/analytics/booking-conversion-metrics"
import { AnalyticsRevenueProjections } from "@/components/analytics/analytics-revenue-projections"

export default function AnalyticsDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      
      if (!supabase) {
        setError("Application is not properly configured")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Auth error:", error)
          setError("Authentication failed")
        } else if (!data?.user) {
          redirect("/auth/login")
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading analytics dashboard...</p>
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

  if (!user) {
    redirect("/auth/login")
    return null
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track performance and gain insights into your platform</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Streaming Data */}
          <div className="lg:col-span-2">
            <LiveStreamingData />
          </div>

          {/* Fan Location Heat Map */}
          <div>
            <FanLocationHeatMap />
          </div>

          {/* Venue Recommendation Engine */}
          <div>
            <VenueRecommendationEngine />
          </div>

          {/* Booking Conversion Metrics */}
          <div>
            <BookingConversionMetrics />
          </div>

          {/* Revenue Projections */}
          <div>
            <AnalyticsRevenueProjections />
          </div>
        </div>
      </div>
    </div>
  )
}