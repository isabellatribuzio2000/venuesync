"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users, Edit } from "lucide-react"
import { useState } from "react"

interface Venue {
  id: string
  name: string
  location: string
  city: string
  state: string
  country: string
  capacity: number
  venue_type: string
  contact_email: string
  website_url: string
}

interface VenueProfileSetupProps {
  venue: Venue | null
}

export function VenueProfileSetup({ venue }: VenueProfileSetupProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    location: venue?.location || "",
    city: venue?.city || "",
    capacity: venue?.capacity || 0,
    venue_type: venue?.venue_type || "",
    contact_email: venue?.contact_email || "",
    website_url: venue?.website_url || "",
  })

  const handleSave = () => {
    // Here you would save to Supabase
    console.log("[v0] Saving venue profile:", formData)
    setIsEditing(false)
  }

  const formatCapacity = (capacity: number) => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K`
    }
    return capacity.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Venue Profile
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          // Display Mode
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{venue?.name || "Venue Name"}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {venue?.location}, {venue?.city}, {venue?.state}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{venue ? formatCapacity(venue.capacity) : "0"} capacity</span>
              </div>
              <div>
                <Badge variant="secondary">{venue?.venue_type || "Unknown"}</Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Contact:</span> {venue?.contact_email || "Not set"}
              </div>
              <div>
                <span className="font-medium">Website:</span>{" "}
                {venue?.website_url ? (
                  <a
                    href={venue.website_url}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {venue.website_url}
                  </a>
                ) : (
                  "Not set"
                )}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input
                  id="venue-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue-type">Venue Type</Label>
                <Input
                  id="venue-type"
                  value={formData.venue_type}
                  onChange={(e) => setFormData({ ...formData, venue_type: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Address</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
