"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Users, Target, TrendingUp, Settings } from "lucide-react"
import { useState } from "react"

interface Venue {
  id: string
  name: string
  capacity: number
  venue_type: string
}

interface CapacityMarketTargetingProps {
  venue: Venue | null
}

const genreTargets = [
  { genre: "Pop", percentage: 35, color: "#1DB954" },
  { genre: "Hip Hop", percentage: 25, color: "#1E3A8A" },
  { genre: "Rock", percentage: 20, color: "#059669" },
  { genre: "Electronic", percentage: 15, color: "#7C3AED" },
  { genre: "Other", percentage: 5, color: "#DC2626" },
]

export function CapacityMarketTargeting({ venue }: CapacityMarketTargetingProps) {
  const [targetCapacity, setTargetCapacity] = useState([85])
  const [priceRange, setPriceRange] = useState([50, 150])

  const formatCapacity = (capacity: number) => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K`
    }
    return capacity.toString()
  }

  const calculateTargetAttendance = () => {
    if (!venue) return 0
    return Math.floor((venue.capacity * targetCapacity[0]) / 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Capacity & Market Targeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Venue Capacity Overview */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Total Capacity</span>
            </div>
            <Badge variant="secondary">{venue ? formatCapacity(venue.capacity) : "0"}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">{venue?.venue_type || "Unknown"} venue type</div>
        </div>

        {/* Target Capacity Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Target Capacity Utilization</Label>
            <Badge variant="outline">{targetCapacity[0]}%</Badge>
          </div>
          <Slider
            value={targetCapacity}
            onValueChange={setTargetCapacity}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            Target attendance: {calculateTargetAttendance().toLocaleString()} people
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Ticket Price Range</Label>
            <Badge variant="outline">
              ${priceRange[0]} - ${priceRange[1]}
            </Badge>
          </div>
          <Slider value={priceRange} onValueChange={setPriceRange} max={300} min={20} step={10} className="w-full" />
        </div>

        {/* Genre Targeting */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-medium">Genre Market Targeting</span>
          </div>
          <div className="space-y-2">
            {genreTargets.map((target) => (
              <div key={target.genre} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: target.color }}></div>
                  <span className="text-sm">{target.genre}</span>
                </div>
                <Badge variant="outline">{target.percentage}%</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Projection */}
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Projected Revenue</span>
            <span className="text-lg font-semibold text-primary">
              ${(calculateTargetAttendance() * ((priceRange[0] + priceRange[1]) / 2)).toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {targetCapacity[0]}% capacity at avg. ${Math.round((priceRange[0] + priceRange[1]) / 2)} ticket
            price
          </div>
        </div>

        <Button className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Update Targeting Strategy
        </Button>
      </CardContent>
    </Card>
  )
}
