"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Activity } from "lucide-react"

export function SystemHealth() {
  const healthMetrics = [
    {
      name: "Database",
      status: "healthy",
      uptime: 99.9,
      responseTime: "12ms",
    },
    {
      name: "API Services",
      status: "healthy",
      uptime: 99.7,
      responseTime: "45ms",
    },
    {
      name: "Spotify Integration",
      status: "healthy",
      uptime: 98.5,
      responseTime: "120ms",
    },
    {
      name: "Email Service",
      status: "warning",
      uptime: 95.2,
      responseTime: "800ms",
    },
  ]

  const getStatusBadge = (status: string) => {
    if (status === "healthy") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Healthy
        </Badge>
      )
    } else if (status === "warning") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Warning
        </Badge>
      )
    }
    return <Badge variant="outline">Unknown</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.name}</span>
                {getStatusBadge(metric.status)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Uptime: {metric.uptime}%</span>
                <span>Response: {metric.responseTime}</span>
              </div>
              <Progress value={metric.uptime} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
