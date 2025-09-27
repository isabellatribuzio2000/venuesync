"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

interface BookingCalendarIntegrationProps {
  venueId: string | undefined
}

const bookings = [
  {
    id: "1",
    date: "2024-03-15",
    time: "20:00",
    artist: "Bad Bunny",
    status: "confirmed",
    ticketsSold: 18500,
    capacity: 20000,
  },
  {
    id: "2",
    date: "2024-03-22",
    time: "19:30",
    artist: "Local Band Night",
    status: "pending",
    ticketsSold: 450,
    capacity: 1000,
  },
  {
    id: "3",
    date: "2024-04-05",
    time: "21:00",
    artist: "Taylor Swift",
    status: "draft",
    ticketsSold: 0,
    capacity: 20000,
  },
]

const availableDates = ["2024-03-28", "2024-04-12", "2024-04-19", "2024-05-03", "2024-05-17"]

export function BookingCalendarIntegration({ venueId }: BookingCalendarIntegrationProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "draft":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateOccupancy = (sold: number, capacity: number) => {
    return Math.round((sold / capacity) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Booking Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Bookings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Upcoming Events</h4>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          {bookings.map((booking) => (
            <div key={booking.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(booking.status)}
                  <span className="font-medium">{formatDate(booking.date)}</span>
                  <span className="text-sm text-muted-foreground">{booking.time}</span>
                </div>
                <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
              </div>

              <div className="mb-2">
                <div className="font-medium">{booking.artist}</div>
                <div className="text-sm text-muted-foreground">
                  {booking.ticketsSold.toLocaleString()} / {booking.capacity.toLocaleString()} tickets
                  {booking.ticketsSold > 0 && (
                    <span className="ml-2">({calculateOccupancy(booking.ticketsSold, booking.capacity)}% sold)</span>
                  )}
                </div>
              </div>

              {booking.ticketsSold > 0 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateOccupancy(booking.ticketsSold, booking.capacity)}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Available Dates */}
        <div className="space-y-3">
          <h4 className="font-medium">Available Dates</h4>
          <div className="grid grid-cols-2 gap-2">
            {availableDates.map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setSelectedDate(selectedDate === date ? null : date)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(date)}
              </Button>
            ))}
          </div>
        </div>

        {/* Calendar Integration Status */}
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800 dark:text-green-200 text-sm">Calendar Sync Active</span>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300">Connected to Google Calendar and Outlook</p>
        </div>
      </CardContent>
    </Card>
  )
}
