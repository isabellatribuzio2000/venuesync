'use client'

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
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
          <p className="text-white mt-4">Loading settings...</p>
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Customize your experience and manage your preferences</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your basic account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Enter your display name"
                  className="bg-[#1a1a1a] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="bg-[#1a1a1a] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your location"
                  className="bg-[#1a1a1a] border-gray-600 text-white"
                />
              </div>

              <Button className="w-full">
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <Switch />
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Booking Updates</Label>
                  <p className="text-sm text-gray-400">Get notified about booking status changes</p>
                </div>
                <Switch />
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Marketing Emails</Label>
                  <p className="text-sm text-gray-400">Receive promotional content and updates</p>
                </div>
                <Switch />
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Weekly Reports</Label>
                  <p className="text-sm text-gray-400">Get weekly performance summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your privacy settings and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Public Profile</Label>
                  <p className="text-sm text-gray-400">Make your profile visible to other users</p>
                </div>
                <Switch />
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Show Contact Info</Label>
                  <p className="text-sm text-gray-400">Display your contact information publicly</p>
                </div>
                <Switch />
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Data Analytics</Label>
                  <p className="text-sm text-gray-400">Allow us to use your data for analytics</p>
                </div>
                <Switch />
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-2">
                <Label className="text-gray-300">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Theme</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Light
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Dark
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Language</Label>
                <Input
                  placeholder="Select language"
                  className="bg-[#1a1a1a] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Time Zone</Label>
                <Input
                  placeholder="Select time zone"
                  className="bg-[#1a1a1a] border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-[#2a2a2a] border-red-600">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-gray-400">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Delete Account</Label>
                <p className="text-sm text-gray-400">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}