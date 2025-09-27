"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  BarChart3
} from "lucide-react"

interface RevenueProjection {
  period: string
  projected: number
  actual: number
  variance: number
  bookings: number
  averageTicketPrice: number
}

interface RevenueData {
  currentRevenue: number
  projectedRevenue: number
  growthRate: number
  monthlyProjections: RevenueProjection[]
  topRevenueStreams: Array<{
    stream: string
    revenue: number
    percentage: number
    growth: number
  }>
  quarterlyTargets: Array<{
    quarter: string
    target: number
    actual: number
    progress: number
  }>
}

export function AnalyticsRevenueProjections() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData({
        currentRevenue: 2850000,
        projectedRevenue: 4200000,
        growthRate: 15.2,
        monthlyProjections: [
          { period: "Jan", projected: 320000, actual: 298000, variance: -6.9, bookings: 45, averageTicketPrice: 6622 },
          { period: "Feb", projected: 380000, actual: 365000, variance: -3.9, bookings: 52, averageTicketPrice: 7019 },
          { period: "Mar", projected: 420000, actual: 445000, variance: 6.0, bookings: 58, averageTicketPrice: 7672 },
          { period: "Apr", projected: 450000, actual: 478000, variance: 6.2, bookings: 62, averageTicketPrice: 7710 },
          { period: "May", projected: 480000, actual: 512000, variance: 6.7, bookings: 68, averageTicketPrice: 7529 },
          { period: "Jun", projected: 520000, actual: 552000, variance: 6.2, bookings: 74, averageTicketPrice: 7459 }
        ],
        topRevenueStreams: [
          { stream: "Venue Bookings", revenue: 1850000, percentage: 64.9, growth: 18.5 },
          { stream: "Artist Commissions", revenue: 650000, percentage: 22.8, growth: 12.3 },
          { stream: "Premium Features", revenue: 250000, percentage: 8.8, growth: 25.7 },
          { stream: "Advertising", revenue: 100000, percentage: 3.5, growth: 8.9 }
        ],
        quarterlyTargets: [
          { quarter: "Q1", target: 1200000, actual: 1108000, progress: 92.3 },
          { quarter: "Q2", target: 1500000, actual: 1542000, progress: 102.8 },
          { quarter: "Q3", target: 1800000, actual: 0, progress: 0 },
          { quarter: "Q4", target: 2000000, actual: 0, progress: 0 }
        ]
      })
      setLoading(false)
    }

    loadData()
  }, [])

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-400"
    if (variance < -5) return "text-red-400"
    return "text-yellow-400"
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-green-400" />
    return <TrendingDown className="w-4 h-4 text-red-400" />
  }

  if (loading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Revenue Projections</CardTitle>
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
          <CardTitle className="text-white">Revenue Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No revenue data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#10b981]" />
          Revenue Projections
        </CardTitle>
        <CardDescription className="text-gray-400">
          Track revenue performance and future projections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-[#10b981]/20 rounded-lg mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-2xl font-bold text-white">${data.currentRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Current Revenue</p>
          </div>
          
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">${data.projectedRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Projected Revenue</p>
          </div>
          
          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">+{data.growthRate}%</p>
            <p className="text-sm text-gray-400">Growth Rate</p>
          </div>
        </div>

        {/* Monthly Projections */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Performance</h3>
          <div className="space-y-3">
            {data.monthlyProjections.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10b981]/20 rounded flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{month.period}</p>
                    <p className="text-sm text-gray-400">{month.bookings} bookings</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-semibold">${month.actual.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">actual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">${month.projected.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">projected</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getVarianceIcon(month.variance)}
                    <span className={`text-sm font-semibold ${getVarianceColor(month.variance)}`}>
                      {month.variance > 0 ? '+' : ''}{month.variance}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Streams */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Streams</h3>
          <div className="space-y-3">
            {data.topRevenueStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10b981]/20 rounded flex items-center justify-center">
                    <span className="text-[#10b981] font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{stream.stream}</p>
                    <p className="text-sm text-gray-400">{stream.percentage}% of total</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-semibold">${stream.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">revenue</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-semibold">+{stream.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly Targets */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quarterly Targets</h3>
          <div className="space-y-3">
            {data.quarterlyTargets.map((quarter, index) => (
              <div key={index} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{quarter.quarter}</h4>
                  <Badge className={
                    quarter.progress >= 100 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : quarter.progress >= 80
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {quarter.progress}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Target: ${quarter.target.toLocaleString()}</span>
                  <span className="text-white">Actual: ${quarter.actual.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}