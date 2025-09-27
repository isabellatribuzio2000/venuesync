const SPOTIFY_BASE_URL = "https://api.spotify.com/v1"

export class SpotifyAPI {
  constructor(accessToken) {
    this.accessToken = accessToken
  }

  async makeRequest(endpoint, options = {}) {
    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    return response.json()
  }

  async getArtist(artistId) {
    return this.makeRequest(`/artists/${artistId}`)
  }

  async getArtistTopTracks(artistId, market = "US") {
    return this.makeRequest(`/artists/${artistId}/top-tracks?market=${market}`)
  }

  async searchArtists(query, limit = 20) {
    const encodedQuery = encodeURIComponent(query)
    return this.makeRequest(`/search?q=${encodedQuery}&type=artist&limit=${limit}`)
  }

  async getUserProfile() {
    return this.makeRequest("/me")
  }

  async getUserTopArtists(timeRange = "medium_term", limit = 20) {
    return this.makeRequest(`/me/top/artists?time_range=${timeRange}&limit=${limit}`)
  }
}
