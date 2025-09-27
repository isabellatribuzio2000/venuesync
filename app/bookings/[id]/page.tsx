import { BookingPageClient } from "./booking-page-client"

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

interface BookingPageProps {
  params: {
    id: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  return <BookingPageClient params={params} />
}