"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Bell,
  LogOut,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react"
import { MobileNav } from "./mobile-nav"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string
  user_type: "artist" | "venue" | "admin"
  first_name?: string
  last_name?: string
  avatar_url?: string
}

interface PageHeaderProps {
  title?: string
  className?: string
}

export function PageHeader({ title, className }: PageHeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Get page title from pathname if not provided
  const getPageTitle = () => {
    if (title) return title
    
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length === 0) return "Dashboard"
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    
    const titleMap: Record<string, string> = {
      'artist': 'Artist Dashboard',
      'venue': 'Venue Connect',
      'analytics': 'Analytics',
      'admin': 'Admin Panel',
      'settings': 'Settings',
      'login': 'Login',
      'signup': 'Sign Up',
    }
    
    return titleMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single()

          if (profile) {
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              user_type: profile.user_type || "artist",
              first_name: profile.first_name,
              last_name: profile.last_name,
              avatar_url: profile.avatar_url,
            })
          } else {
            // Create default profile if none exists
            const { data: newProfile } = await supabase
              .from("profiles")
              .insert({
                id: authUser.id,
                email: authUser.email,
                user_type: "artist",
                first_name: authUser.user_metadata?.full_name?.split(" ")[0] || "User",
                last_name: authUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
              })
              .select()
              .single()

            if (newProfile) {
              setUser({
                id: authUser.id,
                email: authUser.email || "",
                user_type: newProfile.user_type,
                first_name: newProfile.first_name,
                last_name: newProfile.last_name,
                avatar_url: newProfile.avatar_url,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Mock notification count - in real app, this would come from your backend
    setNotificationCount(Math.floor(Math.random() * 5))
  }, [supabase])

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
        alert("Failed to logout. Please try again.")
        return
      }
      
      // Clear user state and local storage
      setUser(null)
      localStorage.clear()
      sessionStorage.clear()
      
      // Redirect to login
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      alert("Failed to logout. Please try again.")
    } finally {
      setLogoutLoading(false)
      setShowLogoutDialog(false)
    }
  }

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
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user?.first_name) {
      return user.first_name
    }
    return user?.email?.split("@")[0] || "User"
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
    <>
      <header className={cn(
        "h-16 bg-[#1f2937] border-b border-gray-700 flex items-center justify-between px-6",
        className
      )}>
        {/* Left Section - Logo & Mobile Nav */}
        <div className="flex items-center gap-3">
          <MobileNav user={user} />
          <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VS</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">VenueSync</h1>
            <p className="text-xs text-gray-400">Music Industry Platform</p>
          </div>
        </div>

        {/* Center Section - Page Title */}
        <div className="flex-1 flex justify-center">
          <h2 className="text-xl font-semibold text-white">
            {getPageTitle()}
          </h2>
        </div>

        {/* Right Section - User Profile & Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Profile Dropdown */}
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-gray-700">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className={cn("text-white text-sm", getRoleColor(user.user_type))}>
                      {getInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getRoleDisplayName(user.user_type)}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1f2937] border-gray-700">
                <DropdownMenuLabel className="text-white">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <Badge 
                      variant="secondary" 
                      className="w-fit text-xs bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                    >
                      {getRoleDisplayName(user.user_type)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="hidden md:block">
                <div className="w-20 h-4 bg-gray-600 rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-600 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-[#1f2937] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              disabled={logoutLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={logoutLoading}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
