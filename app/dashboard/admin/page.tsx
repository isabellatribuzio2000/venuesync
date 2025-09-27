'use client'

import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminUserManagement } from "@/components/admin/admin-user-management"
import { AdminSystemHealth } from '@/components/admin/admin-system-health'
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity'
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Activity, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
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
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Auth error:", error)
          setError("Authentication failed")
        } else if (!user) {
          redirect("/auth/login")
        } else {
          setUser(user)
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
          <p className="text-white mt-4">Loading admin dashboard...</p>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your platform and monitor system health</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Bookings</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Loading...</div>
              <p className="text-xs text-gray-400">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">System Health</CardTitle>
              <Shield className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Good</div>
              <p className="text-xs text-gray-400">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Admin Stats */}
            <Suspense fallback={<Loading />}>
              <AdminStats />
            </Suspense>

            {/* User Management */}
            <Suspense fallback={<Loading />}>
              <AdminUserManagement />
            </Suspense>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Health */}
            <Suspense fallback={<Loading />}>
              <AdminSystemHealth />
            </Suspense>

            {/* Recent Activity */}
            <Suspense fallback={<Loading />}>
              <AdminRecentActivity />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}