"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Building2,
  Music,
  BarChart3,
  Shield,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  user_type: "artist" | "venue" | "admin"
}

interface MobileNavProps {
  user?: User | null
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

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const filteredMenuItems = menuItems.filter(item => 
    user ? item.roles.includes(user.user_type) : item.roles.includes("artist")
  )

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#1f2937] border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
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
        </SheetContent>
      </Sheet>
    </div>
  )
}
