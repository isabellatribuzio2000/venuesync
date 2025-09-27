"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Play, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface StreamingDataPoint {
  time: string
  spotify: number
  appleMusic: number
  youtube: number
  total: number
}

const generateDataPoint = (time: string): StreamingDataPoint => ({
  time,
  spotify: Math.floor(Math.random() * 50000) + 100000,
  appleMusic: Math.floor(Math.random() * 30000) + 60000,
  youtube: Math.floor(Math.random() * 80000) + 150000,
  total: 0,
})

export function LiveStreamingData() {
  const [streamingData, setStreamingData] = useState<StreamingDataPoint[]>(() => {
    const initialData: StreamingDataPoint[] = []
    for (let i = 11; i >= 0; i--) {
      const time = new Date(Date.now() - i * 5 * 60 * 1000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      initialData.push(generateDataPoint(time))
    }
    return initialData.map((point) => ({
      ...point,
      total: point.spotify + point.appleMusic + point.youtube,
    }))
  })

  const [currentStats, setCurrentStats] = useState({
    totalStreams: 0,
    growthRate: 0,
    activeListeners: 0,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

      setStreamingData((prev) => {
        const newPoint = generateDataPoint(now)
        newPoint.total = newPoint.spotify + newPoint.appleMusic + newPoint.youtube

        const newData = [...prev.slice(1), newPoint]

        // Calculate growth rate
        const currentTotal = newPoint.total
        const previousTotal = prev[prev.length - 1]?.total || 0
        const growthRate = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

        setCurrentStats({
          totalStreams: currentTotal,
          growthRate: Number(growthRate.toFixed(1)),
          activeListeners: Math.floor(currentTotal * 0.15), // Estimate active listeners
        })

        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const latestData = streamingData[streamingData.length - 1]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          Live Streaming Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Streams</span>
            </div>
            <div className="text-lg font-semibold">{formatNumber(currentStats.totalStreams)}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span className={currentStats.growthRate >= 0 ? "text-green-600" : "text-red-600"}>
                {currentStats.growthRate >= 0 ? "+" : ""}
                {currentStats.growthRate}%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Active Listeners</span>
            </div>
            <div className="text-lg font-semibold">{formatNumber(currentStats.activeListeners)}</div>
            <div className="text-xs text-muted-foreground">Estimated concurrent</div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Platform Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Spotify</span>
              </div>
              <Badge variant="outline">{formatNumber(latestData?.spotify || 0)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Apple Music</span>
              </div>
              <Badge variant="outline">{formatNumber(latestData?.appleMusic || 0)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">YouTube</span>
              </div>
              <Badge variant="outline">{formatNumber(latestData?.youtube || 0)}</Badge>
            </div>
          </div>
        </div>

        {/* Real-time Chart */}
        <div>
          <h4 className="font-medium text-sm mb-3">Last Hour Trend</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={streamingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value, name) => [formatNumber(Number(value)), name]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line type="monotone" dataKey="spotify" stroke="#1DB954" strokeWidth={2} dot={false} name="Spotify" />
                <Line
                  type="monotone"
                  dataKey="appleMusic"
                  stroke="#007AFF"
                  strokeWidth={2}
                  dot={false}
                  name="Apple Music"
                />
                <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} dot={false} name="YouTube" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Live • Updates every 5 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
