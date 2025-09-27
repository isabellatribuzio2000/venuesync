import { ArtistPageClient } from "./artist-page-client"

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

interface ArtistPageProps {
  params: {
    id: string
  }
}

export default function ArtistPage({ params }: ArtistPageProps) {
  return <ArtistPageClient params={params} />
}