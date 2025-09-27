"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react"

interface RevenueProjectionsProps {
  venueId: string | undefined
}

const monthlyProjections = [
  { month: "Jan", revenue: 450000, bookings: 8 },
  { month: "Feb", revenue: 520000, bookings: 9 },
  { month: "Mar", revenue: 680000, bookings: 12 },
  { month: "Apr", revenue: 750000, bookings: 14 },
  { month: "May", revenue: 890000, bookings: 16 },
  { month: "Jun", revenue: 920000, bookings: 18 },
]

const revenueBreakdown = [
  { category: "Ticket Sales", amount: 2800000, percentage: 70 },
  { category: "Concessions", amount: 560000, percentage: 14 },
  { category: "Merchandise", amount: 400000, percentage: 10 },
  { category: "Parking", amount: 160000, percentage: 4 },
  { category: "Other", amount: 80000, percentage: 2 },
]

export function RevenueProjections({ venueId }: RevenueProjectionsProps) {
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  const totalProjectedRevenue = revenueBreakdown.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Revenue Projections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Annual Target</span>
            </div>
            <div className="text-lg font-semibold">{formatRevenue(totalProjectedRevenue)}</div>
            <div className="text-xs text-muted-foreground">+15% vs last year</div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Events Planned</span>
            </div>
            <div className="text-lg font-semibold">77</div>
            <div className="text-xs text-muted-foreground">6.4 per month avg</div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Monthly Revenue Trend
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProjections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatRevenue(Number(value)), "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1DB954"
                  strokeWidth={2}
                  dot={{ fill: "#1DB954", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div>
          <h4 className="font-medium mb-3">Revenue Breakdown</h4>
          <div className="space-y-3">
            {revenueBreakdown.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-full max-w-[120px]">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.category}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="ml-4">
                  {formatRevenue(item.amount)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="p-3 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Performance vs Target</span>
            <Badge variant="default">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Currently tracking 12% above projected revenue for this quarter
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
