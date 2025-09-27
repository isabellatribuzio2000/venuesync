// components/admin/platform-stats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Music, MapPin, Calendar, TrendingUp, DollarSign } from "lucide-react"

interface PlatformStatsProps {
  stats: {
    totalUsers: number
    totalArtists: number
    totalVenues: number
    totalBookings: number
    recentSignups: number
  }
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: `${stats.recentSignups} new this week`,
      color: "text-blue-600"
    },
    {
      title: "Artists",
      value: stats.totalArtists.toLocaleString(),
      icon: Music,
      description: "Active artists",
      color: "text-purple-600"
    },
    {
      title: "Venues",
      value: stats.totalVenues.toLocaleString(),
      icon: MapPin,
      description: "Partner venues",
      color: "text-green-600"
    },
    {
      title: "Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      description: "Total bookings",
      color: "text-orange-600"
    },
    {
      title: "Growth Rate",
      value: `${Math.round((stats.recentSignups / stats.totalUsers) * 100)}%`,
      icon: TrendingUp,
      description: "Weekly growth",
      color: "text-green-600"
    },
    {
      title: "Revenue",
      value: "$45.6K",
      icon: DollarSign,
      description: "This month",
      color: "text-green-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
