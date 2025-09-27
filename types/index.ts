// Core Types
export interface User {
  id: string
  email: string
  user_type: 'artist' | 'venue' | 'admin'
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Profile extends User {
  company?: string
  bio?: string
  website_url?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

// Artist Types
export interface Artist {
  id: string
  user_id: string
  name: string
  spotify_id?: string
  image_url?: string
  genres?: string[]
  popularity?: number
  followers?: number
  bio?: string
  website_url?: string
  social_links?: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
  }
  created_at: string
  updated_at: string
}

// Venue Types
export interface Venue {
  id: string
  user_id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  capacity: number
  venue_type: 'arena' | 'theater' | 'club' | 'stadium' | 'outdoor' | 'convention_center' | 'restaurant' | 'other'
  contact_email: string
  website_url?: string
  phone?: string
  description?: string
  images?: string[]
  amenities?: string[]
  created_at: string
  updated_at: string
}

// Booking Types
export interface Booking {
  id: string
  artist_id: string
  venue_id: string
  event_name: string
  event_date: string
  event_time: string
  duration: number
  expected_attendance: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  created_at: string
  updated_at: string
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'system' | 'marketing'
  title: string
  message: string
  read: boolean
  action_url?: string
  created_at: string
}

// Analytics Types
export interface StreamingData {
  currentListeners: number
  totalStreams: number
  peakListeners: number
  averageListenTime: number
  topCountries: Array<{
    country: string
    listeners: number
    percentage: number
  }>
  topTracks: Array<{
    name: string
    artist: string
    plays: number
    duration: string
  }>
}

export interface LocationData {
  city: string
  country: string
  listeners: number
  percentage: number
  growth: number
}

export interface VenueRecommendation {
  id: string
  name: string
  city: string
  state: string
  capacity: number
  matchScore: number
  reasons: string[]
  estimatedRevenue: number
  bookingProbability: number
  image?: string
}

export interface ConversionMetrics {
  totalBookings: number
  conversionRate: number
  averageBookingValue: number
  topConvertingSources: Array<{
    source: string
    bookings: number
    conversionRate: number
    revenue: number
  }>
  monthlyTrends: Array<{
    month: string
    bookings: number
    revenue: number
    conversionRate: number
  }>
  funnelSteps: Array<{
    step: string
    visitors: number
    conversions: number
    rate: number
  }>
}

export interface RevenueProjection {
  period: string
  projected: number
  actual: number
  variance: number
  bookings: number
  averageTicketPrice: number
}

export interface RevenueData {
  currentRevenue: number
  projectedRevenue: number
  growthRate: number
  monthlyProjections: RevenueProjection[]
  topRevenueStreams: Array<{
    stream: string
    revenue: number
    percentage: number
    growth: number
  }>
  quarterlyTargets: Array<{
    quarter: string
    target: number
    actual: number
    progress: number
  }>
}

// System Health Types
export interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'error'
    responseTime: number
    connections: number
  }
  api: {
    status: 'healthy' | 'warning' | 'error'
    responseTime: number
    requests: number
  }
  storage: {
    status: 'healthy' | 'warning' | 'error'
    usage: number
    total: number
  }
  uptime: number
}

// Activity Types
export interface Activity {
  id: string
  type: 'user_registered' | 'venue_created' | 'artist_created' | 'booking_created' | 'booking_confirmed'
  user_id: string
  user_name: string
  description: string
  timestamp: string
  metadata?: any
}

// Form Types
export interface VenueFormData {
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
  images?: File[]
}

export interface ArtistFormData {
  name: string
  bio?: string
  website_url?: string
  genres?: string[]
  social_links?: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
  }
  image?: File
}

export interface BookingFormData {
  event_name: string
  event_date: string
  event_time: string
  duration: number
  expected_attendance: number
  notes?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter Types
export interface VenueFilters {
  search?: string
  city?: string
  state?: string
  venue_type?: string
  min_capacity?: number
  max_capacity?: number
  page?: number
}

export interface ArtistFilters {
  search?: string
  genres?: string[]
  popularity_min?: number
  popularity_max?: number
  page?: number
}

export interface BookingFilters {
  status?: string
  date_from?: string
  date_to?: string
  artist_id?: string
  venue_id?: string
  page?: number
}

// Component Props Types
export interface VenueDetailsProps {
  venue: Venue
}

export interface ArtistDetailsProps {
  artist: Artist
}

export interface BookingDetailsProps {
  booking: Booking
}

export interface AdminUserManagementProps {
  users: User[]
}

export interface AdminStatsProps {
  stats?: {
    totalUsers: number
    totalVenues: number
    totalArtists: number
    totalBookings: number
    confirmedBookings: number
    pendingBookings: number
  }
}

// Search Params Types
export interface SearchParams {
  search?: string
  city?: string
  state?: string
  venue_type?: string
  min_capacity?: string
  max_capacity?: string
  page?: string
}

export interface VenuesPageProps {
  searchParams: SearchParams
}

export interface VenuePageProps {
  params: {
    id: string
  }
}

export interface ArtistPageProps {
  params: {
    id: string
  }
}

export interface BookingPageProps {
  params: {
    id: string
  }
}
