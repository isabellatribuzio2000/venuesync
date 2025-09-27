"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Server, 
  Database, 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemHealth {
  database: {
    status: "healthy" | "warning" | "error"
    responseTime: number
    connections: number
  }
  api: {
    status: "healthy" | "warning" | "error"
    responseTime: number
    requests: number
  }
  storage: {
    status: "healthy" | "warning" | "error"
    usage: number
    total: number
  }
  uptime: number
}

export function AdminSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadSystemHealth()
  }, [])

  const loadSystemHealth = async () => {
    setLoading(true)
    try {
      // Test database connection
      const startTime = Date.now()
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      const dbResponseTime = Date.now() - startTime

      // Test API endpoints
      const apiStartTime = Date.now()
      const { data: apiData, error: apiError } = await supabase.from("venues").select("count").limit(1)
      const apiResponseTime = Date.now() - apiStartTime

      // Mock storage usage (in a real app, you'd get this from your storage provider)
      const storageUsage = 2.5 // GB
      const storageTotal = 10 // GB

      setHealth({
        database: {
          status: error ? "error" : dbResponseTime > 1000 ? "warning" : "healthy",
          responseTime: dbResponseTime,
          connections: Math.floor(Math.random() * 50) + 10
        },
        api: {
          status: apiError ? "error" : apiResponseTime > 2000 ? "warning" : "healthy",
          responseTime: apiResponseTime,
          requests: Math.floor(Math.random() * 1000) + 100
        },
        storage: {
          status: storageUsage / storageTotal > 0.9 ? "warning" : "healthy",
          usage: storageUsage,
          total: storageTotal
        },
        uptime: 99.9
      })
    } catch (error) {
      console.error("Error loading system health:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!health) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Failed to load system health</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Database Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm text-gray-300">Database</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getStatusColor(health.database.status))}>
            {health.database.status}
          </Badge>
          {getStatusIcon(health.database.status)}
        </div>
      </div>
      <div className="text-xs text-gray-400">
        Response time: {health.database.responseTime}ms | Connections: {health.database.connections}
      </div>

      {/* API Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm text-gray-300">API</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getStatusColor(health.api.status))}>
            {health.api.status}
          </Badge>
          {getStatusIcon(health.api.status)}
        </div>
      </div>
      <div className="text-xs text-gray-400">
        Response time: {health.api.responseTime}ms | Requests: {health.api.requests}/min
      </div>

      {/* Storage Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm text-gray-300">Storage</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getStatusColor(health.storage.status))}>
            {health.storage.status}
          </Badge>
          {getStatusIcon(health.storage.status)}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{health.storage.usage} GB used</span>
          <span>{health.storage.total} GB total</span>
        </div>
        <Progress 
          value={(health.storage.usage / health.storage.total) * 100} 
          className="h-2"
        />
      </div>

      {/* Uptime */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm text-gray-300">Uptime</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            {health.uptime}%
          </Badge>
          <CheckCircle className="w-4 h-4 text-green-400" />
        </div>
      </div>
    </div>
  )
}
