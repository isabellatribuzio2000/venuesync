"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Users, 
  TrendingUp,
  Globe
} from "lucide-react"

interface LocationData {
  city: string
  country: string
  listeners: number
  percentage: number
  growth: number
}

export function FanLocationHeatMap() {
  const [data, setData] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData([
        { city: "New York", country: "United States", listeners: 1234, percentage: 18.5, growth: 12.3 },
        { city: "Los Angeles", country: "United States", listeners: 987, percentage: 14.8, growth: 8.7 },
        { city: "London", country: "United Kingdom", listeners: 756, percentage: 11.3, growth: 15.2 },
        { city: "Toronto", country: "Canada", listeners: 543, percentage: 8.1, growth: 6.4 },
        { city: "Sydney", country: "Australia", listeners: 432, percentage: 6.5, growth: 9.8 },
        { city: "Berlin", country: "Germany", listeners: 321, percentage: 4.8, growth: 4.2 },
        { city: "Paris", country: "France", listeners: 298, percentage: 4.5, growth: 7.1 },
        { city: "Tokyo", country: "Japan", listeners: 267, percentage: 4.0, growth: 11.5 },
        { city: "Amsterdam", country: "Netherlands", listeners: 234, percentage: 3.5, growth: 5.9 },
        { city: "Melbourne", country: "Australia", listeners: 198, percentage: 3.0, growth: 8.3 }
      ])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Fan Location Heat Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#10b981]" />
          Fan Location Heat Map
        </CardTitle>
        <CardDescription className="text-gray-400">
          Geographic distribution of your fanbase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10b981]/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#10b981]" />
                </div>
                <div>
                  <p className="text-white font-medium">{location.city}</p>
                  <p className="text-sm text-gray-400">{location.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white font-semibold">{location.listeners.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{location.percentage}%</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+{location.growth}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-semibold">Total Global Reach</h4>
            <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
              {data.reduce((sum, loc) => sum + loc.listeners, 0).toLocaleString()} fans
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Globe className="w-4 h-4" />
            <span>Active in {data.length} cities worldwide</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}