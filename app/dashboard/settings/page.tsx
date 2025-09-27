import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Configuration Required</h1>
          <p className="text-gray-400">
            Application is not properly configured for this environment.
          </p>
        </div>
      </div>
    )
  }

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={profile?.first_name || ""}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={profile?.last_name || ""}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={data.user.email || ""}
                  disabled
                  className="bg-[#1a1a1a] border-gray-700 text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="userType" className="text-gray-300">Account Type</Label>
                <Input
                  id="userType"
                  defaultValue={profile?.user_type || "artist"}
                  disabled
                  className="bg-[#1a1a1a] border-gray-700 text-gray-400"
                />
              </div>
              <Button className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <Switch />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications</p>
                </div>
                <Switch />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Marketing Emails</Label>
                  <p className="text-sm text-gray-400">Receive promotional content</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Change Password</Label>
                <p className="text-sm text-gray-400 mb-2">Update your account password</p>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Change Password
                </Button>
              </div>
              <Separator className="bg-gray-700" />
              <div>
                <Label className="text-gray-300">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-400 mb-2">Add an extra layer of security</p>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-[#2a2a2a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize your interface appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Dark Mode</Label>
                  <p className="text-sm text-gray-400">Use dark theme</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Compact Mode</Label>
                  <p className="text-sm text-gray-400">Use compact interface</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
