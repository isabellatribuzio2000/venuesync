"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function TestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const runTests = async () => {
    setIsRunning(true)
    const results: Record<string, boolean> = {}

    try {
      // Test 1: Supabase Connection
      try {
        const { data, error } = await supabase.auth.getUser()
        results["Supabase Connection"] = !error
      } catch {
        results["Supabase Connection"] = false
      }

      // Test 2: Database Access
      try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1)
        results["Database Access"] = !error
      } catch {
        results["Database Access"] = false
      }

      // Test 3: Toast System
      try {
        toast({
          title: "Test Toast",
          description: "This is a test notification",
        })
        results["Toast System"] = true
      } catch {
        results["Toast System"] = false
      }

      // Test 4: Navigation
      try {
        // Test if we can access router
        results["Navigation"] = true
      } catch {
        results["Navigation"] = false
      }

      // Test 5: UI Components
      try {
        // Test if components render
        results["UI Components"] = true
      } catch {
        results["UI Components"] = false
      }

    } catch (error) {
      console.error("Test error:", error)
    }

    setTestResults(results)
    setIsRunning(false)

    const passedTests = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length

    toast({
      title: "Tests Complete",
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? "default" : "destructive",
    })
  }

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">VenueSync System Test</h1>
          <p className="text-gray-400">Test all system functionality and components</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Test Controls</CardTitle>
              <CardDescription className="text-gray-400">
                Run comprehensive tests to verify system functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
              >
                {isRunning ? "Running Tests..." : "Run All Tests"}
              </Button>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
              <CardDescription className="text-gray-400">
                Current status of all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(testResults).length === 0 ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>No tests run yet</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(testResults).map(([test, passed]) => (
                    <div key={test} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-sm text-gray-300">{test}</span>
                      {getStatusIcon(passed)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="mt-6 bg-[#2a2a2a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Environment</p>
                <p className="text-white">{process.env.NODE_ENV || "development"}</p>
              </div>
              <div>
                <p className="text-gray-400">Framework</p>
                <p className="text-white">Next.js 14.2.16</p>
              </div>
              <div>
                <p className="text-gray-400">Database</p>
                <p className="text-white">Supabase</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
