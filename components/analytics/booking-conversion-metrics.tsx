"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Target, TrendingUp, Users, Calendar, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface ConversionData {
  stage: string
  count: number
  percentage: number
  color: string
}

interface WeeklyData {
  week: string
  inquiries: number
  bookings: number
  conversion: number
}

const initialConversionData: ConversionData[] = [
  { stage: "Initial Inquiries", count: 1250, percentage: 100, color: "#E5E7EB" },
  { stage: "Venue Matches", count: 890, percentage: 71, color: "#93C5FD" },
  { stage: "Proposals Sent", count: 520, percentage: 42, color: "#60A5FA" },
  { stage: "Negotiations", count: 280, percentage: 22, color: "#3B82F6" },
  { stage: "Confirmed Bookings", count: 165, percentage: 13, color: "#1DB954" },
]

const weeklyData: WeeklyData[] = [
  { week: "Week 1", inquiries: 280, bookings: 32, conversion: 11.4 },
  { week: "Week 2", inquiries: 320, bookings: 45, conversion: 14.1 },
  { week: "Week 3", inquiries: 295, bookings: 38, conversion: 12.9 },
  { week: "Week 4", inquiries: 355, bookings: 50, conversion: 14.1 },
]

export function BookingConversionMetrics() {
  const [conversionData, setConversionData] = useState(initialConversionData)
  const [currentMetrics, setCurrentMetrics] = useState({
    overallConversion: 13.2,
    avgResponseTime: 4.2,
    successRate: 78.5,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConversionData((prev) =>
        prev.map((stage, index) => {
          const baseCount = initialConversionData[index].count
          const variation = Math.floor(Math.random() * 40 - 20)
          const newCount = Math.max(0, baseCount + variation)
          const percentage = index === 0 ? 100 : (newCount / prev[0].count) * 100

          return {
            ...stage,
            count: newCount,
            percentage: Math.round(percentage),
          }
        }),
      )

      setCurrentMetrics({
        overallConversion: +(Math.random() * 5 + 11).toFixed(1),
        avgResponseTime: +(Math.random() * 2 + 3).toFixed(1),
        successRate: +(Math.random() * 10 + 75).toFixed(1),
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Booking Conversion Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Overall Conversion</span>
            </div>
            <div className="text-lg font-semibold">{currentMetrics.overallConversion}%</div>
            <div className="text-xs text-muted-foreground">Inquiry to booking rate</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Response Time</span>
              </div>
              <div className="text-lg font-semibold">{currentMetrics.avgResponseTime}h</div>
              <div className="text-xs text-muted-foreground">Average</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-lg font-semibold">{currentMetrics.successRate}%</div>
              <div className="text-xs text-muted-foreground">Proposal to booking</div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div>
          <h4 className="font-medium text-sm mb-3">Conversion Funnel</h4>
          <div className="space-y-3">
            {conversionData.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatNumber(stage.count)}</span>
                    <Badge variant="outline" className="text-xs">
                      {stage.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${stage.percentage}%`,
                        backgroundColor: stage.color,
                      }}
                    ></div>
                  </div>
                  {index < conversionData.length - 1 && (
                    <div className="absolute -bottom-2 right-0 text-xs text-muted-foreground">
                      -{Math.round(100 - conversionData[index + 1].percentage)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div>
          <h4 className="font-medium text-sm mb-3">Weekly Conversion Trend</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "conversion" ? `${value}%` : value,
                    name === "inquiries" ? "Inquiries" : name === "bookings" ? "Bookings" : "Conversion Rate",
                  ]}
                />
                <Bar dataKey="conversion" fill="#1DB954" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Leads</span>
            </div>
            <div className="text-lg font-semibold">{formatNumber(conversionData[2]?.count || 0)}</div>
            <div className="text-xs text-muted-foreground">In negotiation</div>
          </div>

          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-lg font-semibold">{formatNumber(conversionData[4]?.count || 0)}</div>
            <div className="text-xs text-muted-foreground">Confirmed bookings</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Metrics update every 8 seconds • Real-time pipeline tracking
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
