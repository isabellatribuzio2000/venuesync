'use client'

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp,
  MapPin,
  Plus,
  Settings,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default function VenueDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      
      if (!supabase) {
        setError("Application is not properly configured")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Auth error:", error)
          setError("Authentication failed")
        } else if (!data?.user) {
          redirect("/auth/login")
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading venue dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Configuration Required</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect("/auth/login")
    return null
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Venue Dashboard</h1>
          <p className="text-gray-400">Manage your venue, track bookings, and grow your business</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Capacity</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">Max capacity</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">+22.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Rating</CardTitle>
              <Building2 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">Based on 48 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Bookings */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Bookings</CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest artist bookings and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">The Weeknd</h3>
                        <p className="text-sm text-gray-400">March 15, 2024 • 8:00 PM</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Confirmed
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Billie Eilish</h3>
                        <p className="text-sm text-gray-400">March 22, 2024 • 7:30 PM</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                      Pending
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Analytics */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Track your venue's financial performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p>Revenue charts will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking Request
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Venue Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">The Weeknd</p>
                      <p className="text-xs text-gray-400">March 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Billie Eilish</p>
                      <p className="text-xs text-gray-400">March 22, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Information */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Venue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Los Angeles, CA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Capacity: 2,500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Concert Hall</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}