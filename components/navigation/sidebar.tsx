"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Home,
  Building2,
  Music,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string
  user_type: "artist" | "venue" | "admin"
  first_name?: string
  last_name?: string
  avatar_url?: string
}

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    roles: ["artist", "venue", "admin"],
  },
  {
    name: "Venue Connect",
    href: "/dashboard/venue",
    icon: Building2,
    roles: ["venue", "admin"],
  },
  {
    name: "Artist Dashboard",
    href: "/dashboard/artist",
    icon: Music,
    roles: ["artist", "admin"],
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["artist", "venue", "admin"],
  },
  {
    name: "Admin Panel",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ["admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["artist", "venue", "admin"],
  },
]

export function Sidebar({ className }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!supabase) {
          return
        }
        
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
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, toast])

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      if (!supabase) {
        setLogoutLoading(false)
        return
      }
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
        toast({
          title: "Logout Failed",
          description: "Failed to logout. Please try again.",
          variant: "destructive",
        })
        return
      }
      
      // Clear user state
      setUser(null)
      
      // Show success message
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      
      // Redirect to login
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLogoutLoading(false)
    }
  }

  const filteredMenuItems = menuItems.filter(item => 
    user ? item.roles.includes(user.user_type) : item.roles.includes("artist")
  )

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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1a1a1a] border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
        <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">VenueSync</h1>
          <p className="text-xs text-gray-400">Music Industry Platform</p>
        </div>
      </div>

      {/* User Profile */}
      {!loading && user && (
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-[#10b981] text-white">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {getUserDisplayName()}
              </p>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                >
                  {user.user_type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#10b981] text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Notifications */}
      {!loading && user && (
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center justify-center">
            <NotificationCenter />
          </div>
        </div>
      )}

      {/* Logout Button */}
      {!loading && user && (
        <div className="px-4 py-4 border-t border-gray-800">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-300 hover:bg-red-900/20 hover:text-red-400"
                disabled={logoutLoading}
              >
                <LogOut className="w-5 h-5" />
                <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1a1a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
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
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-64 lg:flex-col", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-[#1a1a1a] text-white hover:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#1a1a1a] border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VenueSync</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}