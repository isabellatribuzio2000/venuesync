"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Music } from "lucide-react"
import { useEffect, useState } from "react"

interface StreamingData {
  platform: string
  streams: number
  change: number
  color: string
  icon: string
}

interface RealTimeStreamingWidgetProps {
  artistId: string | undefined
}

export function RealTimeStreamingWidget({ artistId }: RealTimeStreamingWidgetProps) {
  const [streamingData, setStreamingData] = useState<StreamingData[]>([
    { platform: "Spotify", streams: 1250000, change: 5.2, color: "#1DB954", icon: "spotify" },
    { platform: "Apple Music", streams: 890000, change: 3.1, color: "#FA243C", icon: "apple" },
    { platform: "YouTube", streams: 2100000, change: 8.7, color: "#FF0000", icon: "youtube" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamingData((prev) =>
        prev.map((item) => ({
          ...item,
          streams: item.streams + Math.floor(Math.random() * 1000 + 100),
          change: +(Math.random() * 10 - 2).toFixed(1),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatStreams = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#1DB954]/10">
            <Activity className="h-5 w-5 text-[#1DB954] animate-pulse" />
          </div>
          Real-Time Streaming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {streamingData.map((platform, index) => (
          <div
            key={platform.platform}
            className="group p-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
                  <Music className="h-4 w-4" style={{ color: platform.color }} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{platform.platform}</div>
                  <div className="text-2xl font-bold tabular-nums" style={{ color: platform.color }}>
                    {formatStreams(platform.streams)}
                  </div>
                  <div className="text-xs text-muted-foreground">streams today</div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={platform.change >= 0 ? "default" : "destructive"}
                  className={`text-xs font-semibold ${
                    platform.change >= 0
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20"
                  }`}
                >
                  <TrendingUp className={`h-3 w-3 mr-1 ${platform.change < 0 ? "rotate-180" : ""}`} />
                  {platform.change >= 0 ? "+" : ""}
                  {platform.change}%
                </Badge>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#1DB954] rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground font-medium">Live Updates</span>
            </div>
            <span className="text-xs text-muted-foreground">Refreshes every 3s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
