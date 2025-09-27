'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  id: string
  user: string
  action: string
  timestamp: string
  type: 'signup' | 'booking' | 'login' | 'error'
}

export default function AdminRecentActivity() {
  // Mock data for now
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      user: 'Sarah Johnson',
      action: 'Signed up as Artist',
      timestamp: '2 minutes ago',
      type: 'signup'
    },
    {
      id: '2',
      user: 'Mike Chen',
      action: 'Booked venue: Blue Note Jazz Club',
      timestamp: '15 minutes ago',
      type: 'booking'
    },
    {
      id: '3',
      user: 'Emma Wilson',
      action: 'Connected Spotify account',
      timestamp: '32 minutes ago',
      type: 'login'
    }
  ]

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'signup':
        return 'text-green-600'
      case 'booking':
        return 'text-blue-600'
      case 'login':
        return 'text-gray-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest user actions and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{activity.user}</p>
                <p className={`text-sm ${getActivityColor(activity.type)}`}>{activity.action}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
