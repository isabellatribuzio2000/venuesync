"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loading } from "@/components/ui/loading"
import { 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Upload, 
  MapPin, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  capacity: number
  venue_type: string
  contact_email: string
  website_url?: string
  phone?: string
  description?: string
  images?: string[]
  created_at: string
  updated_at: string
}

interface VenueProfileEditorProps {
  venueId?: string
  onSave?: (venue: Venue) => void
  onCancel?: () => void
}

const VENUE_TYPES = [
  { value: "arena", label: "Arena" },
  { value: "theater", label: "Theater" },
  { value: "club", label: "Club" },
  { value: "stadium", label: "Stadium" },
  { value: "outdoor", label: "Outdoor Venue" },
  { value: "convention_center", label: "Convention Center" },
  { value: "restaurant", label: "Restaurant/Bar" },
  { value: "other", label: "Other" }
]

export function VenueProfileEditor({ venueId, onSave, onCancel }: VenueProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(!venueId)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [venue, setVenue] = useState<Venue | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    capacity: 0,
    venue_type: "",
    contact_email: "",
    website_url: "",
    phone: "",
    description: ""
  })
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (venueId) {
      loadVenue()
    }
  }, [venueId])

  useEffect(() => {
    // Check if form is dirty
    if (venue) {
      const hasChanges = Object.keys(formData).some(key => {
        const value = formData[key as keyof typeof formData]
        const originalValue = venue[key as keyof Venue]
        return value !== originalValue
      })
      setIsDirty(hasChanges)
    }
  }, [formData, venue])

  const loadVenue = async () => {
    if (!venueId) return

    setLoading(true)
    try {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("id", venueId)
        .single()

      if (error) throw error

      if (data) {
        setVenue(data)
        setFormData({
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
          capacity: data.capacity || 0,
          venue_type: data.venue_type || "",
          contact_email: data.contact_email || "",
          website_url: data.website_url || "",
          phone: data.phone || "",
          description: data.description || ""
        })
        setImages(data.images || [])
      }
    } catch (error) {
      console.error("Error loading venue:", error)
      toast({
        title: "Error",
        description: "Failed to load venue data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Venue name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required"
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = "Capacity must be at least 1"
    if (!formData.venue_type) newErrors.venue_type = "Venue type is required"
    if (!formData.contact_email.trim()) newErrors.contact_email = "Contact email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = "Invalid email format"
    }
    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
      newErrors.website_url = "Website URL must start with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      if (!supabase) {
        toast({
          title: "Configuration Error",
          description: "Application is not properly configured",
          variant: "destructive",
        })
        setSaving(false)
        return
      }
      
      const venueData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip: formData.zip.trim(),
        capacity: formData.capacity,
        venue_type: formData.venue_type,
        contact_email: formData.contact_email.trim(),
        website_url: formData.website_url.trim() || null,
        phone: formData.phone.trim() || null,
        description: formData.description.trim() || null,
        images: images,
        updated_at: new Date().toISOString()
      }

      let result
      if (venueId) {
        // Update existing venue
        const { data, error } = await supabase
          .from("venues")
          .update(venueData)
          .eq("id", venueId)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Create new venue
        const { data, error } = await supabase
          .from("venues")
          .insert(venueData)
          .select()
          .single()

        if (error) throw error
        result = data
      }

      setVenue(result)
      setIsEditing(false)
      setIsDirty(false)
      
      toast({
        title: "Success",
        description: venueId ? "Venue updated successfully" : "Venue created successfully",
      })

      if (onSave) onSave(result)
    } catch (error) {
      console.error("Error saving venue:", error)
      toast({
        title: "Error",
        description: "Failed to save venue",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (venue) {
      setFormData({
        name: venue.name || "",
        address: venue.address || "",
        city: venue.city || "",
        state: venue.state || "",
        zip: venue.zip || "",
        capacity: venue.capacity || 0,
        venue_type: venue.venue_type || "",
        contact_email: venue.contact_email || "",
        website_url: venue.website_url || "",
        phone: venue.phone || "",
        description: venue.description || ""
      })
      setImages(venue.images || [])
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        capacity: 0,
        venue_type: "",
        contact_email: "",
        website_url: "",
        phone: "",
        description: ""
      })
      setImages([])
    }
    setErrors({})
    setIsEditing(false)
    setIsDirty(false)
    if (onCancel) onCancel()
  }

  const handleDelete = async () => {
    if (!venueId) return

    setDeleting(true)
    try {
      if (!supabase) {
        toast({
          title: "Configuration Error",
          description: "Application is not properly configured",
          variant: "destructive",
        })
        setDeleting(false)
        return
      }
      
      const { error } = await supabase
        .from("venues")
        .delete()
        .eq("id", venueId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Venue deleted successfully",
      })

      router.push("/venues")
    } catch (error) {
      console.error("Error deleting venue:", error)
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    try {
      if (!supabase) {
        setUploadingImages(false)
        return
      }
      
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `venue-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('venue-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('venue-images')
          .getPublicUrl(filePath)

        return data.publicUrl
      })

      const newImageUrls = await Promise.all(uploadPromises)
      setImages(prev => [...prev, ...newImageUrls])
      setIsDirty(true)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  if (loading) {
    return <Loading text="Loading venue..." />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {venue ? "Venue Profile" : "Create Venue Profile"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {venue ? "Manage your venue information" : "Set up your venue profile"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && venue && (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1a1a1a] border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Venue</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete this venue? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Venue Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="Enter venue name"
                />
                {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="venue_type" className="text-gray-300">Venue Type *</Label>
                <Select
                  value={formData.venue_type}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, venue_type: value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-gray-700">
                    {VENUE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.venue_type && <p className="text-sm text-red-400">{errors.venue_type}</p>}
              </div>

              <div>
                <Label htmlFor="capacity" className="text-gray-300">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="Enter capacity"
                />
                {errors.capacity && <p className="text-sm text-red-400">{errors.capacity}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_email" className="text-gray-300">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, contact_email: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="contact@venue.com"
                />
                {errors.contact_email && <p className="text-sm text-red-400">{errors.contact_email}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="website_url" className="text-gray-300">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, website_url: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="https://venue.com"
                />
                {errors.website_url && <p className="text-sm text-red-400">{errors.website_url}</p>}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-300">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, address: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="123 Main Street"
                />
                {errors.address && <p className="text-sm text-red-400">{errors.address}</p>}
              </div>
              <div>
                <Label htmlFor="city" className="text-gray-300">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, city: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="City"
                />
                {errors.city && <p className="text-sm text-red-400">{errors.city}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="text-gray-300">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, state: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="State"
                />
                {errors.state && <p className="text-sm text-red-400">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zip" className="text-gray-300">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, zip: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  placeholder="12345"
                />
                {errors.zip && <p className="text-sm text-red-400">{errors.zip}</p>}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Description */}
          <div className="space-y-4">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, description: e.target.value }))
                setIsDirty(true)
              }}
              disabled={!isEditing}
              className="bg-[#1a1a1a] border-gray-700 text-white"
              placeholder="Describe your venue, its atmosphere, and what makes it special..."
              rows={4}
            />
          </div>

          <Separator className="bg-gray-700" />

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Venue Images
              </h3>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      disabled={uploadingImages}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImages ? "Uploading..." : "Upload Images"}
                    </Button>
                  </Label>
                </div>
              )}
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Venue image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No images uploaded yet</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#10b981] hover:bg-[#0d9d6b] text-white"
                disabled={saving || !isDirty}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
