"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Building2, 
  Music, 
  Calendar,
  TrendingUp,
  DollarSign,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformStats {
  totalUsers: number
  totalVenues: number
  totalArtists: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  totalRevenue: number
  monthlyRevenue: number
  activeUsers: number
  newUsersThisMonth: number
}

export function AdminStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      // Get all stats in parallel
      const [
        { count: totalUsers },
        { count: totalVenues },
        { count: totalArtists },
        { count: totalBookings },
        { count: pendingBookings },
        { count: confirmedBookings },
        { data: revenueData },
        { data: monthlyRevenueData },
        { count: activeUsers },
        { count: newUsersThisMonth }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("venues").select("*", { count: "exact", head: true }),
        supabase.from("artists").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("bookings").select("offer_amount").eq("status", "confirmed"),
        supabase.from("bookings").select("offer_amount").eq("status", "confirmed").gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("updated_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
      ])

      const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.offer_amount || 0), 0) || 0
      const monthlyRevenue = monthlyRevenueData?.reduce((sum, booking) => sum + (booking.offer_amount || 0), 0) || 0

      setStats({
        totalUsers: totalUsers || 0,
        totalVenues: totalVenues || 0,
        totalArtists: totalArtists || 0,
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        confirmedBookings: confirmedBookings || 0,
        totalRevenue,
        monthlyRevenue,
        activeUsers: activeUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-[#2a2a2a] border-gray-800">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-8 bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Failed to load statistics</p>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      change: `+${stats.newUsersThisMonth} this month`
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      change: "Last 7 days"
    },
    {
      title: "Total Venues",
      value: stats.totalVenues.toLocaleString(),
      icon: Building2,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      change: "Registered venues"
    },
    {
      title: "Total Artists",
      value: stats.totalArtists.toLocaleString(),
      icon: Music,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      change: "Registered artists"
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      change: "All time"
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings.toLocaleString(),
      icon: Calendar,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      change: "Awaiting approval"
    },
    {
      title: "Confirmed Bookings",
      value: stats.confirmedBookings.toLocaleString(),
      icon: Calendar,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      change: "Active bookings"
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      change: "This month"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card key={index} className="bg-[#2a2a2a] border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <Badge variant="secondary" className="text-xs bg-gray-500/20 text-gray-400">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
