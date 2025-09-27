"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, TrendingUp, Calendar, Target, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

interface MonthlyProjection {
  month: string
  actual: number
  projected: number
  target: number
}

interface RevenueSource {
  name: string
  value: number
  color: string
  growth: number
}

const monthlyData: MonthlyProjection[] = [
  { month: "Jan", actual: 450000, projected: 480000, target: 500000 },
  { month: "Feb", actual: 520000, projected: 550000, target: 580000 },
  { month: "Mar", actual: 680000, projected: 720000, target: 750000 },
  { month: "Apr", actual: 0, projected: 850000, target: 900000 },
  { month: "May", actual: 0, projected: 920000, target: 980000 },
  { month: "Jun", actual: 0, projected: 1050000, target: 1100000 },
]

const initialRevenueSources: RevenueSource[] = [
  { name: "Venue Bookings", value: 2800000, color: "#1DB954", growth: 15.2 },
  { name: "Commission Fees", value: 420000, color: "#1E3A8A", growth: 22.8 },
  { name: "Premium Features", value: 180000, color: "#059669", growth: 45.3 },
  { name: "Consulting Services", value: 120000, color: "#7C3AED", growth: 38.7 },
]

export function AnalyticsRevenueProjections() {
  const [revenueSources, setRevenueSources] = useState(initialRevenueSources)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"monthly" | "quarterly" | "yearly">("monthly")
  const [currentMetrics, setCurrentMetrics] = useState({
    totalRevenue: 3520000,
    growthRate: 18.5,
    projectedAnnual: 8400000,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenueSources((prev) =>
        prev.map((source) => ({
          ...source,
          value: source.value + Math.floor(Math.random() * 10000 - 5000),
          growth: +(Math.random() * 20 + 10).toFixed(1),
        })),
      )

      setCurrentMetrics((prev) => ({
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 20000 - 10000),
        growthRate: +(Math.random() * 10 + 15).toFixed(1),
        projectedAnnual: prev.projectedAnnual + Math.floor(Math.random() * 100000 - 50000),
      }))
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  const totalCurrentRevenue = revenueSources.reduce((sum, source) => sum + source.value, 0)
  const avgGrowthRate = revenueSources.reduce((sum, source) => sum + source.growth, 0) / revenueSources.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Revenue Projections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium">Total Revenue (YTD)</span>
            </div>
            <div className="text-2xl font-bold">{formatRevenue(currentMetrics.totalRevenue)}</div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+{currentMetrics.growthRate}% vs last year</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Annual Target</span>
              </div>
              <div className="text-lg font-semibold">{formatRevenue(currentMetrics.projectedAnnual)}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((currentMetrics.totalRevenue / currentMetrics.projectedAnnual) * 100)}% achieved
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Avg Growth</span>
              </div>
              <div className="text-lg font-semibold">+{avgGrowthRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Across all revenue streams</div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          {(["monthly", "quarterly", "yearly"] as const).map((timeframe) => (
            <Button
              key={timeframe}
              size="sm"
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              onClick={() => setSelectedTimeframe(timeframe)}
              className="text-xs"
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>

        {/* Revenue Trend Chart */}
        <div>
          <h4 className="font-medium text-sm mb-3">Revenue Trend vs Projections</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatRevenue(Number(value)), ""]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#1DB954"
                  strokeWidth={3}
                  dot={{ fill: "#1DB954", strokeWidth: 2, r: 4 }}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#1E3A8A"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#1E3A8A", strokeWidth: 2, r: 3 }}
                  name="Projected"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#DC2626"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ fill: "#DC2626", strokeWidth: 2, r: 3 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Sources Breakdown */}
        <div>
          <h4 className="font-medium text-sm mb-3">Revenue Sources</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueSources} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                    {revenueSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatRevenue(Number(value)), "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with Growth */}
            <div className="space-y-3">
              {revenueSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatRevenue(source.value)}</div>
                    <Badge variant="outline" className="text-xs">
                      +{source.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Q1 Performance Summary</span>
            <Badge variant="default">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above Target
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Revenue is tracking {Math.round(((currentMetrics.totalRevenue - 1650000) / 1650000) * 100)}% above Q1
            projections, with strong growth in premium features and consulting services.
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Revenue data updates every 12 seconds • Projections based on current booking pipeline
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
