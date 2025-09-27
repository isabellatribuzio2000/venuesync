"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  Volume2, 
  Users, 
  TrendingUp,
  Activity
} from "lucide-react"

interface StreamingData {
  currentListeners: number
  totalStreams: number
  peakListeners: number
  averageListenTime: number
  topCountries: Array<{
    country: string
    listeners: number
    percentage: number
  }>
  topTracks: Array<{
    name: string
    artist: string
    plays: number
    duration: string
  }>
}

export function LiveStreamingData() {
  const [data, setData] = useState<StreamingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading streaming data
    const loadData = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData({
        currentListeners: 1247,
        totalStreams: 45632,
        peakListeners: 2156,
        averageListenTime: 3.2,
        topCountries: [
          { country: "United States", listeners: 456, percentage: 36.6 },
          { country: "United Kingdom", listeners: 234, percentage: 18.8 },
          { country: "Canada", listeners: 189, percentage: 15.2 },
          { country: "Australia", listeners: 156, percentage: 12.5 },
          { country: "Germany", listeners: 98, percentage: 7.9 }
        ],
        topTracks: [
          { name: "Midnight Dreams", artist: "Artist Name", plays: 1234, duration: "3:45" },
          { name: "Electric Nights", artist: "Artist Name", plays: 987, duration: "4:12" },
          { name: "Summer Vibes", artist: "Artist Name", plays: 756, duration: "3:28" }
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
          <CardTitle className="text-white">Live Streaming Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-700 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Live Streaming Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No streaming data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#10b981]" />
          Live Streaming Data
        </CardTitle>
        <CardDescription className="text-gray-400">
          Real-time streaming analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-[#10b981]/20 rounded-lg mx-auto mb-2">
              <Users className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-2xl font-bold text-white">{data.currentListeners.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Current Listeners</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-2">
              <Play className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{data.totalStreams.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Streams</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{data.peakListeners.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Peak Listeners</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-lg mx-auto mb-2">
              <Volume2 className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">{data.averageListenTime}h</p>
            <p className="text-sm text-gray-400">Avg. Listen Time</p>
          </div>
        </div>

        {/* Top Countries */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Top Countries</h3>
          <div className="space-y-3">
            {data.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">{country.country}</span>
                  <Badge variant="secondary" className="text-xs">
                    {country.listeners} listeners
                  </Badge>
                </div>
                <div className="flex items-center gap-2 w-32">
                  <Progress value={country.percentage} className="h-2" />
                  <span className="text-xs text-gray-400 w-8">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tracks */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Top Tracks</h3>
          <div className="space-y-3">
            {data.topTracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10b981]/20 rounded flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{track.plays} plays</span>
                  <span>{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}