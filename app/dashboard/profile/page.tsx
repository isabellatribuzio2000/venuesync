import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (firstName) {
      return firstName[0].toUpperCase()
    }
    return "U"
  }

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    if (profile?.first_name) {
      return profile.first_name
    }
    return data.user.email?.split("@")[0] || "User"
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'artist': 'Artist',
      'venue': 'Venue Manager',
      'admin': 'Administrator',
    }
    return roleMap[role] || role
  }

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'artist': 'bg-blue-500',
      'venue': 'bg-purple-500',
      'admin': 'bg-red-500',
    }
    return colorMap[role] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className={cn("text-white text-2xl", getRoleColor(profile?.user_type || "artist"))}>
                  {getInitials(profile?.first_name, profile?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">{getUserDisplayName()}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                  >
                    {getRoleDisplayName(profile?.user_type || "artist")}
                  </Badge>
                  <span className="text-gray-400 text-sm">
                    Member since {new Date(profile?.created_at || data.user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal details and profile information
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
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
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
                    defaultValue={getRoleDisplayName(profile?.user_type || "artist")}
                    disabled
                    className="bg-[#1a1a1a] border-gray-700 text-gray-400"
                  />
                </div>
                <Button className="bg-[#10b981] hover:bg-[#0d9d6b] text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5" />
                  Account Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View your account information and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Email Verified</p>
                    <p className="text-xs text-gray-400">
                      {data.user.email_confirmed_at ? "Verified" : "Not verified"}
                    </p>
                  </div>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Account Created</p>
                    <p className="text-xs text-gray-400">
                      {new Date(data.user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">User ID</p>
                    <p className="text-xs text-gray-400 font-mono">
                      {data.user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
