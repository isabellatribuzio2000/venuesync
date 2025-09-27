// components/admin/admin-system-health.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminSystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Current system status and performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Database Status</span>
          <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>API Response Time</span>
          <Badge variant="secondary">245ms</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Spotify Integration</span>
          <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Active Users (24h)</span>
          <Badge variant="secondary">156</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Error Rate</span>
          <Badge variant="default" className="bg-green-100 text-green-800">0.02%</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
