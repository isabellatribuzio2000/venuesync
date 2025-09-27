"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Plus, Route, GripVertical, Clock } from "lucide-react"
import { useState } from "react"

interface TourDate {
  id: string
  date: string
  venue: string
  city: string
  status: "confirmed" | "pending" | "draft"
  capacity: number
  revenue: number
}

interface TourPlanningToolProps {
  artistId: string | undefined
}

const initialTourDates: TourDate[] = [
  {
    id: "1",
    date: "2024-03-15",
    venue: "Madison Square Garden",
    city: "New York, NY",
    status: "confirmed",
    capacity: 20000,
    revenue: 850000,
  },
  {
    id: "2",
    date: "2024-03-22",
    venue: "The Fillmore",
    city: "San Francisco, CA",
    status: "pending",
    capacity: 1315,
    revenue: 125000,
  },
  {
    id: "3",
    date: "2024-04-05",
    venue: "Red Rocks Amphitheatre",
    city: "Morrison, CO",
    status: "draft",
    capacity: 9525,
    revenue: 420000,
  },
]

export function TourPlanningTool({ artistId }: TourPlanningToolProps) {
  const [tourDates, setTourDates] = useState<TourDate[]>(initialTourDates)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = tourDates.findIndex((date) => date.id === draggedItem)
    const targetIndex = tourDates.findIndex((date) => date.id === targetId)

    const newTourDates = [...tourDates]
    const [draggedDate] = newTourDates.splice(draggedIndex, 1)
    newTourDates.splice(targetIndex, 0, draggedDate)

    setTourDates(newTourDates)
    setDraggedItem(null)
  }

  const totalRevenue = tourDates.reduce((sum, date) => sum + date.revenue, 0)

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#1DB954]/10">
            <Route className="h-5 w-5 text-[#1DB954]" />
          </div>
          Tour Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#1DB954]/5 to-[#1DB954]/10 border border-[#1DB954]/20">
          <div>
            <div className="text-sm text-muted-foreground">{tourDates.length} dates planned</div>
            <div className="font-bold text-lg text-[#1DB954]">{formatRevenue(totalRevenue)} projected</div>
          </div>
          <Button size="sm" className="bg-[#1DB954] hover:bg-[#1DB954]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Date
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {tourDates.map((date, index) => (
            <div
              key={date.id}
              draggable
              onDragStart={(e) => handleDragStart(e, date.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date.id)}
              className={`group p-4 rounded-xl border bg-gradient-to-r from-background/50 to-background/30 hover:shadow-md transition-all duration-300 cursor-move ${
                draggedItem === date.id ? "opacity-50 scale-95" : "hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{formatDate(date.date)}</span>
                    </div>
                    <Badge className={getStatusColor(date.status)}>{date.status}</Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{date.venue}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {date.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {date.capacity.toLocaleString()} capacity
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#1DB954]">{formatRevenue(date.revenue)} projected</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50 space-y-2">
          <Button className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90" size="sm">
            <Route className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
          <Button variant="outline" className="w-full bg-transparent" size="sm">
            Export Tour Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
