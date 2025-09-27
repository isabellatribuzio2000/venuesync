export class VenueRecommendationEngine {
  constructor() {
    this.weights = {
      capacity: 0.3,
      location: 0.25,
      genre: 0.2,
      popularity: 0.15,
      revenue: 0.1,
    }
  }

  async getVenueRecommendations(artistData, venueData) {
    const recommendations = venueData.map((venue) => {
      const score = this.calculateMatchScore(artistData, venue)
      return {
        ...venue,
        totalScore: Math.round(score),
        estimatedRevenue: this.calculateRevenue(artistData, venue),
        keyInsights: this.generateInsights(artistData, venue, score),
      }
    })

    return recommendations.sort((a, b) => b.totalScore - a.totalScore)
  }

  calculateMatchScore(artist, venue) {
    let score = 0

    // Capacity matching (optimal is 70-90% of venue capacity)
    const optimalAttendance = venue.capacity * 0.8
    const expectedAttendance = Math.min(artist.followers?.total * 0.001, venue.capacity)
    const capacityScore = Math.max(
      0,
      100 - (Math.abs(optimalAttendance - expectedAttendance) / optimalAttendance) * 100,
    )
    score += capacityScore * this.weights.capacity

    // Popularity boost
    score += (artist.popularity || 50) * this.weights.popularity

    // Base venue quality
    score += 70 * this.weights.location

    return Math.min(100, score)
  }

  calculateRevenue(artist, venue) {
    const baseTicketPrice = venue.capacity > 1000 ? 75 : venue.capacity > 500 ? 55 : 35
    const popularityMultiplier = (artist.popularity || 50) / 50
    const expectedSales = Math.min(venue.capacity * 0.85, artist.followers?.total * 0.0008)

    return Math.round(baseTicketPrice * popularityMultiplier * expectedSales)
  }

  generateInsights(artist, venue, score) {
    const insights = []

    if (score > 85) {
      insights.push(`Perfect match for ${artist.name}'s fanbase size and venue capacity`)
    } else if (score > 70) {
      insights.push(`Good venue match with strong revenue potential`)
    } else {
      insights.push(`Consider for future tours as fanbase grows`)
    }

    return insights
  }
}
