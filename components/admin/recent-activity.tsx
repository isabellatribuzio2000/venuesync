"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, UserPlus, Music, MapPin } from "lucide-react"

interface User {
  id: string
  email: string
  user_type: string
  first_name: string
  last_name: string
  created_at: string
}

interface RecentActivityProps {
  users: User[]
}

export function RecentActivity({ users }: RecentActivityProps) {
  const getActivityIcon = (userType: string) => {
    switch (userType) {
      case "artist":
        return <Music className="w-4 h-4 text-purple-600" />
      case "venue_manager":
        return <MapPin className="w-4 h-4 text-green-600" />
      default:
        return <UserPlus className="w-4 h-4 text-blue-600" />
    }
  }

  const getUserTypeLabel = (userType: string) => {
    return userType.replace("_", " ")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            users.map((user, index) => (
              <div key={index} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                {getActivityIcon(user.user_type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {user.first_name} {user.last_name} joined as {getUserTypeLabel(user.user_type)}
                  </div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
