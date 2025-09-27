export const mockArtistData = {
  tame_impala: {
    id: "tame_impala",
    name: "Tame Impala",
    genres: ["psychedelic rock", "neo-psychedelia", "indie rock"],
    popularity: 85,
    followers: { total: 3200000 },
    images: [{ url: "/tame-impala-psychedelic-band.jpg" }],
    realTimeData: {
      currentStreams: 2500000,
      dailyGrowth: 3.2,
    },
  },
  billie_eilish: {
    id: "billie_eilish",
    name: "Billie Eilish",
    genres: ["pop", "electropop", "indie pop"],
    popularity: 95,
    followers: { total: 45000000 },
    images: [{ url: "/billie-eilish-pop-star.jpg" }],
    realTimeData: {
      currentStreams: 8500000,
      dailyGrowth: 4.1,
    },
  },
  arctic_monkeys: {
    id: "arctic_monkeys",
    name: "Arctic Monkeys",
    genres: ["indie rock", "alternative rock", "garage rock"],
    popularity: 88,
    followers: { total: 12000000 },
    images: [{ url: "/arctic-monkeys-indie-rock-band.jpg" }],
    realTimeData: {
      currentStreams: 4200000,
      dailyGrowth: 2.8,
    },
  },
}

export const mockVenueData = [
  {
    id: "venue_1",
    name: "The Fillmore",
    city: "San Francisco",
    capacity: 1150,
    type: "Concert Hall",
    estimatedRevenue: 125000,
    totalScore: 92,
  },
  {
    id: "venue_2",
    name: "Brooklyn Bowl",
    city: "New York",
    capacity: 600,
    type: "Music Venue",
    estimatedRevenue: 85000,
    totalScore: 88,
  },
  {
    id: "venue_3",
    name: "The Troubadour",
    city: "Los Angeles",
    capacity: 500,
    type: "Historic Venue",
    estimatedRevenue: 95000,
    totalScore: 85,
  },
]
