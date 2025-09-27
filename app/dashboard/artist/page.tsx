import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SpotifyArtistProfile } from "@/components/dashboard/spotify-artist-profile"
import { RealTimeStreamingWidget } from "@/components/dashboard/real-time-streaming-widget"
import { FanDemographicsChart } from "@/components/dashboard/fan-demographics-chart"
import { VenueRecommendations } from "@/components/dashboard/venue-recommendations"
import { TourPlanningTool } from "@/components/dashboard/tour-planning-tool"
import { PresaleSetupInterface } from "@/components/dashboard/presale-setup-interface"

export default async function ArtistDashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get artist data (for demo, we'll use the first artist)
  const { data: artist } = await supabase.from("artists").select("*").limit(1).single()

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Streaming */}
          <div className="lg:col-span-1 space-y-6">
            <SpotifyArtistProfile artist={artist} />
            <RealTimeStreamingWidget artistId={artist?.id} />
          </div>

          {/* Middle Column - Demographics & Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            <FanDemographicsChart artistId={artist?.id} />
            <VenueRecommendations artistId={artist?.id} />
          </div>

          {/* Right Column - Tour Planning & Presale */}
          <div className="lg:col-span-1 space-y-6">
            <TourPlanningTool artistId={artist?.id} />
            <PresaleSetupInterface artistId={artist?.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
