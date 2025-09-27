"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface LocationData {
  city: string
  country: string
  fans: number
  growth: number
  coordinates: [number, number]
}

const locationData: LocationData[] = [
  { city: "Los Angeles", country: "USA", fans: 125000, growth: 8.5, coordinates: [34.0522, -118.2437] },
  { city: "New York", country: "USA", fans: 98000, growth: 12.3, coordinates: [40.7128, -74.006] },
  { city: "London", country: "UK", fans: 87000, growth: 6.7, coordinates: [51.5074, -0.1278] },
  { city: "Toronto", country: "Canada", fans: 76000, growth: 15.2, coordinates: [43.6532, -79.3832] },
  { city: "Mexico City", country: "Mexico", fans: 92000, growth: 22.1, coordinates: [19.4326, -99.1332] },
  { city: "São Paulo", country: "Brazil", fans: 84000, growth: 18.9, coordinates: [-23.5505, -46.6333] },
  { city: "Madrid", country: "Spain", fans: 65000, growth: 9.4, coordinates: [40.4168, -3.7038] },
  { city: "Berlin", country: "Germany", fans: 58000, growth: 7.8, coordinates: [52.52, 13.405] },
]

export function FanLocationHeatMap() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [animatedData, setAnimatedData] = useState(locationData)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedData((prev) =>
        prev.map((location) => ({
          ...location,
          fans: location.fans + Math.floor(Math.random() * 100 - 50),
          growth: +(Math.random() * 30 - 5).toFixed(1),
        })),
      )
    }, 10000)

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

  const getIntensityColor = (fans: number) => {
    const maxFans = Math.max(...animatedData.map((d) => d.fans))
    const intensity = fans / maxFans
    if (intensity > 0.8) return "bg-red-500"
    if (intensity > 0.6) return "bg-orange-500"
    if (intensity > 0.4) return "bg-yellow-500"
    if (intensity > 0.2) return "bg-green-500"
    return "bg-blue-500"
  }

  const totalFans = animatedData.reduce((sum, location) => sum + location.fans, 0)
  const avgGrowth = animatedData.reduce((sum, location) => sum + location.growth, 0) / animatedData.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Fan Location Heat Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Fans</span>
            </div>
            <div className="text-lg font-semibold">{formatNumber(totalFans)}</div>
            <div className="text-xs text-muted-foreground">Across {animatedData.length} cities</div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Avg Growth</span>
            </div>
            <div className="text-lg font-semibold">+{avgGrowth.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </div>
        </div>

        {/* Heat Map Visualization */}
        <div>
          <h4 className="font-medium text-sm mb-3">Geographic Distribution</h4>
          <div className="relative p-4 rounded-lg bg-muted/20 min-h-[200px]">
            {/* Simulated world map with dots */}
            <div className="relative w-full h-48 bg-gradient-to-b from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg overflow-hidden">
              {animatedData.map((location, index) => (
                <div
                  key={`${location.city}-${location.country}`}
                  className={`absolute w-3 h-3 rounded-full ${getIntensityColor(
                    location.fans,
                  )} cursor-pointer transition-all duration-300 hover:scale-150 animate-pulse`}
                  style={{
                    left: `${20 + (index % 4) * 20}%`,
                    top: `${20 + Math.floor(index / 4) * 25}%`,
                  }}
                  onClick={() => setSelectedLocation(location)}
                  title={`${location.city}, ${location.country}: ${formatNumber(location.fans)} fans`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Top Locations List */}
        <div>
          <h4 className="font-medium text-sm mb-3">Top Locations</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {animatedData
              .sort((a, b) => b.fans - a.fans)
              .slice(0, 6)
              .map((location) => (
                <div
                  key={`${location.city}-${location.country}`}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedLocation?.city === location.city ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${getIntensityColor(location.fans)}`}></div>
                    <div>
                      <div className="font-medium text-sm">
                        {location.city}, {location.country}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatNumber(location.fans)} fans</div>
                    </div>
                  </div>
                  <Badge variant={location.growth >= 0 ? "default" : "destructive"} className="text-xs">
                    {location.growth >= 0 ? "+" : ""}
                    {location.growth}%
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-2">
              {selectedLocation.city}, {selectedLocation.country}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fan Count:</span>
                <div className="font-semibold">{formatNumber(selectedLocation.fans)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Growth Rate:</span>
                <div className={`font-semibold ${selectedLocation.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {selectedLocation.growth >= 0 ? "+" : ""}
                  {selectedLocation.growth}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Data updates every 10 seconds • Click locations for details
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
