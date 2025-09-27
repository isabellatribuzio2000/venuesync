"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Calendar,
  DollarSign
} from "lucide-react"

interface Booking {
  id: string
  artist_id?: string
  venue_id?: string
  user_id: string
  event_date: string
  event_time?: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  ticket_price_min?: number
  ticket_price_max?: number
  expected_attendance?: number
  offer_amount?: number
  event_type?: string
  notes?: string
  created_at: string
  updated_at: string
  artist?: {
    id: string
    name: string
    image_url?: string
    followers?: number
    popularity?: number
  }
  venue?: {
    id: string
    name: string
    city: string
    state: string
    capacity?: number
  }
}

interface BookingActionsProps {
  booking: Booking
  userType: string
}

export function BookingActions({ booking, userType }: BookingActionsProps) {
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const supabase = createClient()
  const { toast } = useToast()

  const updateBookingStatus = async (status: string) => {
    setActionLoading(status)
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", booking.id)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Booking status updated to ${status}`,
      })

      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const canConfirm = userType === "venue" && booking.status === "pending"
  const canCancel = (userType === "venue" || userType === "artist") && 
    (booking.status === "pending" || booking.status === "confirmed")
  const canComplete = userType === "venue" && booking.status === "confirmed"

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Actions</CardTitle>
        <CardDescription className="text-gray-400">
          Manage this booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Confirm Booking */}
        {canConfirm && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={actionLoading === "confirmed"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {actionLoading === "confirmed" ? "Confirming..." : "Confirm Booking"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1a1a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Confirm Booking</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to confirm this booking? This will notify the artist and lock in the event details.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateBookingStatus("confirmed")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Complete Booking */}
        {canComplete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={actionLoading === "completed"}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {actionLoading === "completed" ? "Completing..." : "Mark as Completed"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1a1a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Complete Booking</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Mark this booking as completed? This will finalize the event and update the status.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateBookingStatus("completed")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Complete Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Cancel Booking */}
        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                disabled={actionLoading === "cancelled"}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {actionLoading === "cancelled" ? "Cancelling..." : "Cancel Booking"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1a1a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Cancel Booking</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to cancel this booking? This action cannot be undone and will notify all parties involved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateBookingStatus("cancelled")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Contact Actions */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => {
              // TODO: Implement messaging system
              toast({
                title: "Coming Soon",
                description: "Messaging system will be available soon",
              })
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>

        {/* Status Information */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            <p className="mb-2">Current Status: <span className="text-white font-semibold capitalize">{booking.status}</span></p>
            <p className="text-xs">
              Created: {new Date(booking.created_at).toLocaleDateString()}
            </p>
            {booking.updated_at !== booking.created_at && (
              <p className="text-xs">
                Updated: {new Date(booking.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
