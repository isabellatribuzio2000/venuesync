import { VenuePageClient } from "./venue-page-client"

export async function generateStaticParams() {
  // For static export, we'll generate a limited set of common IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ]
}

interface VenuePageProps {
  params: {
    id: string
  }
}

export default function VenuePage({ params }: VenuePageProps) {
  return <VenuePageClient params={params} />
}