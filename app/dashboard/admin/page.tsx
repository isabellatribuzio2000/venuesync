import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminUserManagement } from "@/components/admin/admin-user-management"
import { AdminSystemHealth } from "@/components/admin/admin-system-health"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Activity, BarChart3 } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and check admin access
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single()

  if (!profile || profile.user_type !== "admin") {
    redirect("/dashboard")
  }

  // Get users for admin management
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Manage the VenueSync platform and monitor system health
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <Suspense fallback={<Loading text="Loading stats..." />}>
            <AdminStats />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Health */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor platform status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Loading text="Loading system health..." />}>
                  <AdminSystemHealth />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Latest platform activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Loading text="Loading activity..." />}>
                  <AdminRecentActivity />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Management */}
        <div className="mt-8">
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loading text="Loading users..." />}>
                <AdminUserManagement users={users || []} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}