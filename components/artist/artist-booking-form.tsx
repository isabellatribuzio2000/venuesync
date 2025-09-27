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
import { CalendarIcon, Clock, DollarSign, Users, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArtistBookingFormProps {
  artistId: string
}

export function ArtistBookingForm({ artistId }: ArtistBookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    event_date: "",
    event_time: "",
    venue_name: "",
    venue_address: "",
    venue_city: "",
    venue_state: "",
    expected_attendance: 0,
    offer_amount: 0,
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
    if (!formData.venue_name.trim()) newErrors.venue_name = "Venue name is required"
    if (!formData.venue_address.trim()) newErrors.venue_address = "Venue address is required"
    if (!formData.venue_city.trim()) newErrors.venue_city = "Venue city is required"
    if (!formData.venue_state.trim()) newErrors.venue_state = "Venue state is required"
    if (!formData.expected_attendance || formData.expected_attendance < 1) {
      newErrors.expected_attendance = "Expected attendance is required"
    }
    if (!formData.offer_amount || formData.offer_amount < 0) {
      newErrors.offer_amount = "Offer amount is required"
    }
    if (!formData.event_type) newErrors.event_type = "Event type is required"

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

      // Get venue profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()

      if (!profile || profile.user_type !== "venue") {
        throw new Error("Only venues can request artist bookings")
      }

      // Create booking request
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          artist_id: artistId,
          user_id: user.id,
          event_date: formData.event_date,
          event_time: formData.event_time,
          venue_name: formData.venue_name,
          venue_address: formData.venue_address,
          venue_city: formData.venue_city,
          venue_state: formData.venue_state,
          expected_attendance: formData.expected_attendance,
          offer_amount: formData.offer_amount,
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
        venue_name: "",
        venue_address: "",
        venue_city: "",
        venue_state: "",
        expected_attendance: 0,
        offer_amount: 0,
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

      {/* Venue Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Venue Information
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="venue_name" className="text-gray-300">Venue Name *</Label>
          <Input
            id="venue_name"
            value={formData.venue_name}
            onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
            className="bg-[#1a1a1a] border-gray-700 text-white"
            placeholder="Enter venue name"
          />
          {errors.venue_name && <p className="text-sm text-red-400">{errors.venue_name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue_address" className="text-gray-300">Venue Address *</Label>
          <Input
            id="venue_address"
            value={formData.venue_address}
            onChange={(e) => setFormData(prev => ({ ...prev, venue_address: e.target.value }))}
            className="bg-[#1a1a1a] border-gray-700 text-white"
            placeholder="Enter venue address"
          />
          {errors.venue_address && <p className="text-sm text-red-400">{errors.venue_address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venue_city" className="text-gray-300">City *</Label>
            <Input
              id="venue_city"
              value={formData.venue_city}
              onChange={(e) => setFormData(prev => ({ ...prev, venue_city: e.target.value }))}
              className="bg-[#1a1a1a] border-gray-700 text-white"
              placeholder="City"
            />
            {errors.venue_city && <p className="text-sm text-red-400">{errors.venue_city}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="venue_state" className="text-gray-300">State *</Label>
            <Input
              id="venue_state"
              value={formData.venue_state}
              onChange={(e) => setFormData(prev => ({ ...prev, venue_state: e.target.value }))}
              className="bg-[#1a1a1a] border-gray-700 text-white"
              placeholder="State"
            />
            {errors.venue_state && <p className="text-sm text-red-400">{errors.venue_state}</p>}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Event Details
        </h3>
        
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

        <div className="space-y-2">
          <Label htmlFor="offer_amount" className="text-gray-300">Offer Amount ($) *</Label>
          <Input
            id="offer_amount"
            type="number"
            value={formData.offer_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, offer_amount: parseFloat(e.target.value) || 0 }))}
            min="0"
            step="0.01"
            className="bg-[#1a1a1a] border-gray-700 text-white"
            placeholder="0.00"
          />
          {errors.offer_amount && <p className="text-sm text-red-400">{errors.offer_amount}</p>}
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
