'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { BookingList } from "@/components/booking/booking-list"
import { BookingFilters } from "@/components/booking/booking-filters"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Search, Filter } from "lucide-react"

interface SearchParams {
  status?: string
  event_date_from?: string
  event_date_to?: string
  page?: string
}

interface BookingsPageProps {
  searchParams?: SearchParams
}

export default function BookingsPage({ searchParams = {} }: BookingsPageProps) {
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
          <p className="text-white mt-4">Loading bookings...</p>
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

  // Get filter values from search params
  const filters = {
    status: searchParams.status || "",
    event_date_from: searchParams.event_date_from || "",
    event_date_to: searchParams.event_date_to || "",
    page: parseInt(searchParams.page || "1")
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bookings</h1>
          <p className="text-gray-400">Manage and track all your venue bookings</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <BookingFilters currentFilters={filters} userType="artist" />
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                All Bookings
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and manage your booking requests and confirmed events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingList filters={filters} userType="artist" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}