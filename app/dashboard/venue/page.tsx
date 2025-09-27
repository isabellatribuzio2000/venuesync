import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VenueProfileSetup } from "@/components/venue/venue-profile-setup"
import { CapacityMarketTargeting } from "@/components/venue/capacity-market-targeting"
import { ArtistMatchingAlgorithm } from "@/components/venue/artist-matching-algorithm"
import { BookingCalendarIntegration } from "@/components/venue/booking-calendar-integration"
import { RevenueProjections } from "@/components/venue/revenue-projections"
import { SpotifyPresaleSettings } from "@/components/venue/spotify-presale-settings"

export default async function VenueConnectPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get venue data (for demo, we'll use the first venue)
  const { data: venue } = await supabase.from("venues").select("*").limit(1).single()

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <VenueProfileSetup venue={venue} />
            <CapacityMarketTargeting venue={venue} />
            <BookingCalendarIntegration venueId={venue?.id} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ArtistMatchingAlgorithm venueId={venue?.id} />
            <RevenueProjections venueId={venue?.id} />
            <SpotifyPresaleSettings venueId={venue?.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
