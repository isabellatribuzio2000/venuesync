"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, DollarSign, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface VenueBookingFormProps {
  venueId: string
}

export function VenueBookingForm({ venueId }: VenueBookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    event_date: "",
    event_time: "",
    expected_attendance: 0,
    ticket_price_min: 0,
    ticket_price_max: 0,
    event_type: "",
    notes: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const supabase = createClient()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.event_date) newErrors.event_date = "Event date is required"
    if (!formData.event_time) newErrors.event_time = "Event time is required"
    if (!formData.expected_attendance || formData.expected_attendance < 1) {
      newErrors.expected_attendance = "Expected attendance is required"
    }
    if (!formData.event_type) newErrors.event_type = "Event type is required"
    if (formData.ticket_price_min < 0) newErrors.ticket_price_min = "Minimum price cannot be negative"
    if (formData.ticket_price_max < formData.ticket_price_min) {
      newErrors.ticket_price_max = "Maximum price must be greater than minimum price"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (!supabase) {
        toast({
          title: "Configuration Error",
          description: "Application is not properly configured",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Get artist profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()

      if (!profile || profile.user_type !== "artist") {
        throw new Error("Only artists can request bookings")
      }

      // Create booking request
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          venue_id: venueId,
          user_id: user.id,
          event_date: formData.event_date,
          event_time: formData.event_time,
          expected_attendance: formData.expected_attendance,
          ticket_price_min: formData.ticket_price_min,
          ticket_price_max: formData.ticket_price_max,
          event_type: formData.event_type,
          notes: formData.notes,
          status: "pending"
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been submitted successfully",
      })

      // Reset form
      setFormData({
        event_date: "",
        event_time: "",
        expected_attendance: 0,
        ticket_price_min: 0,
        ticket_price_max: 0,
        event_type: "",
        notes: ""
      })
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast({
        title: "Error",
        description: "Failed to submit booking request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const eventTypes = [
    "Concert",
    "Festival",
    "Club Night",
    "Private Event",
    "Corporate Event",
    "Wedding",
    "Other"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Event Date */}
      <div className="space-y-2">
        <Label htmlFor="event_date" className="text-gray-300">Event Date *</Label>
        <Input
          id="event_date"
          type="date"
          value={formData.event_date}
          onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
          min={new Date().toISOString().split('T')[0]}
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
        {errors.event_date && <p className="text-sm text-red-400">{errors.event_date}</p>}
      </div>

      {/* Event Time */}
      <div className="space-y-2">
        <Label htmlFor="event_time" className="text-gray-300">Event Time *</Label>
        <Input
          id="event_time"
          type="time"
          value={formData.event_time}
          onChange={(e) => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
          className="bg-[#1a1a1a] border-gray-700 text-white"
        />
        {errors.event_time && <p className="text-sm text-red-400">{errors.event_time}</p>}
      </div>

      {/* Event Type */}
      <div className="space-y-2">
        <Label htmlFor="event_type" className="text-gray-300">Event Type *</Label>
        <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
          <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a2a] border-gray-700">
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-white">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.event_type && <p className="text-sm text-red-400">{errors.event_type}</p>}
      </div>

      {/* Expected Attendance */}
      <div className="space-y-2">
        <Label htmlFor="expected_attendance" className="text-gray-300">Expected Attendance *</Label>
        <Input
          id="expected_attendance"
          type="number"
          value={formData.expected_attendance}
          onChange={(e) => setFormData(prev => ({ ...prev, expected_attendance: parseInt(e.target.value) || 0 }))}
          min="1"
          className="bg-[#1a1a1a] border-gray-700 text-white"
          placeholder="Number of attendees"
        />
        {errors.expected_attendance && <p className="text-sm text-red-400">{errors.expected_attendance}</p>}
      </div>

      {/* Ticket Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ticket_price_min" className="text-gray-300">Min Ticket Price ($)</Label>
          <Input
            id="ticket_price_min"
            type="number"
            value={formData.ticket_price_min}
            onChange={(e) => setFormData(prev => ({ ...prev, ticket_price_min: parseFloat(e.target.value) || 0 }))}
            min="0"
            step="0.01"
            className="bg-[#1a1a1a] border-gray-700 text-white"
            placeholder="0.00"
          />
          {errors.ticket_price_min && <p className="text-sm text-red-400">{errors.ticket_price_min}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ticket_price_max" className="text-gray-300">Max Ticket Price ($)</Label>
          <Input
            id="ticket_price_max"
            type="number"
            value={formData.ticket_price_max}
            onChange={(e) => setFormData(prev => ({ ...prev, ticket_price_max: parseFloat(e.target.value) || 0 }))}
            min="0"
            step="0.01"
            className="bg-[#1a1a1a] border-gray-700 text-white"
            placeholder="0.00"
          />
          {errors.ticket_price_max && <p className="text-sm text-red-400">{errors.ticket_price_max}</p>}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-gray-300">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="bg-[#1a1a1a] border-gray-700 text-white"
          placeholder="Any additional information about your event..."
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#10b981] hover:bg-[#0d9d6b] text-white"
      >
        {loading ? "Submitting..." : "Submit Booking Request"}
      </Button>
    </form>
  )
}
