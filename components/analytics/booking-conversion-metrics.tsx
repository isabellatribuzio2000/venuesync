"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Calendar,
  DollarSign,
  Target
} from "lucide-react"

interface ConversionMetrics {
  totalBookings: number
  conversionRate: number
  averageBookingValue: number
  topConvertingSources: Array<{
    source: string
    bookings: number
    conversionRate: number
    revenue: number
  }>
  monthlyTrends: Array<{
    month: string
    bookings: number
    revenue: number
    conversionRate: number
  }>
  funnelSteps: Array<{
    step: string
    visitors: number
    conversions: number
    rate: number
  }>
}

export function BookingConversionMetrics() {
  const [data, setData] = useState<ConversionMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData({
        totalBookings: 1247,
        conversionRate: 12.4,
        averageBookingValue: 2850,
        topConvertingSources: [
          { source: "Direct Website", bookings: 456, conversionRate: 18.2, revenue: 1299600 },
          { source: "Social Media", bookings: 321, conversionRate: 14.7, revenue: 914850 },
          { source: "Email Campaigns", bookings: 234, conversionRate: 22.1, revenue: 666900 },
          { source: "Partner Referrals", bookings: 156, conversionRate: 16.8, revenue: 444600 },
          { source: "Search Ads", bookings: 80, conversionRate: 8.9, revenue: 228000 }
        ],
        monthlyTrends: [
          { month: "Jan", bookings: 98, revenue: 279300, conversionRate: 11.2 },
          { month: "Feb", bookings: 112, revenue: 319200, conversionRate: 12.8 },
          { month: "Mar", bookings: 134, revenue: 381900, conversionRate: 13.5 },
          { month: "Apr", bookings: 156, revenue: 444600, conversionRate: 14.2 },
          { month: "May", bookings: 189, revenue: 538650, conversionRate: 15.1 },
          { month: "Jun", bookings: 203, revenue: 578550, conversionRate: 16.3 }
        ],
        funnelSteps: [
          { step: "Website Visitors", visitors: 10000, conversions: 10000, rate: 100 },
          { step: "Venue Browsers", visitors: 3500, conversions: 3500, rate: 35 },
          { step: "Profile Views", visitors: 1800, conversions: 1800, rate: 18 },
          { step: "Booking Inquiries", visitors: 450, conversions: 450, rate: 4.5 },
          { step: "Confirmed Bookings", visitors: 1247, conversions: 1247, rate: 12.4 }
        ]
      })
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Booking Conversion Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Booking Conversion Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No conversion data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-[#10b981]" />
          Booking Conversion Metrics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Track and optimize your booking conversion rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-[#10b981]/20 rounded-lg mx-auto mb-2">
              <Calendar className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-2xl font-bold text-white">{data.totalBookings.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Bookings</p>
          </div>
          
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{data.conversionRate}%</p>
            <p className="text-sm text-gray-400">Conversion Rate</p>
          </div>
          
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">${data.averageBookingValue.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Avg. Booking Value</p>
          </div>
        </div>

        {/* Top Converting Sources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Top Converting Sources</h3>
          <div className="space-y-3">
            {data.topConvertingSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10b981]/20 rounded flex items-center justify-center">
                    <span className="text-[#10b981] font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{source.source}</p>
                    <p className="text-sm text-gray-400">{source.bookings} bookings</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-semibold">{source.conversionRate}%</p>
                    <p className="text-xs text-gray-400">conversion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${source.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {data.funnelSteps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{step.step}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{step.visitors.toLocaleString()}</span>
                    <span className="text-sm text-white font-semibold">{step.rate}%</span>
                  </div>
                </div>
                <Progress value={step.rate} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}