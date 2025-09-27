"use client"

import { useState, useEffect } from "react"

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${window?.location?.origin}/dashboard/artist`
const SCOPES = "user-read-private user-read-email user-top-read user-read-recently-played"

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for access token in URL hash (after redirect)
    const hash = window.location.hash
    if (hash) {
      const token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        ?.split("=")[1]
      if (token) {
        setAccessToken(token)
        setIsAuthenticated(true)
        window.location.hash = ""
        localStorage.setItem("spotify_access_token", token)
      }
    }

    // Check for stored token
    const storedToken = localStorage.getItem("spotify_access_token")
    if (storedToken) {
      setAccessToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  const loginWithSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`
    window.location.href = authUrl
  }

  const logout = () => {
    setAccessToken(null)
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("spotify_access_token")
  }

  return {
    isAuthenticated,
    accessToken,
    user,
    loginWithSpotify,
    logout,
  }
}

export function useSpotifyData() {
  const { accessToken } = useSpotifyAuth()

  const makeSpotifyRequest = async (endpoint) => {
    if (!accessToken) throw new Error("No access token")

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) throw new Error("Spotify API request failed")
    return response.json()
  }

  const getArtistData = async (artistId) => {
    try {
      const artist = await makeSpotifyRequest(`/artists/${artistId}`)
      const topTracks = await makeSpotifyRequest(`/artists/${artistId}/top-tracks?market=US`)

      return {
        ...artist,
        topTracks: topTracks.tracks,
        realTimeData: {
          currentStreams: Math.floor(Math.random() * 1000000) + 500000,
          dailyGrowth: (Math.random() * 5).toFixed(1),
        },
      }
    } catch (error) {
      console.error("Error fetching artist data:", error)
      throw error
    }
  }

  const searchArtists = async (query) => {
    try {
      const results = await makeSpotifyRequest(`/search?q=${encodeURIComponent(query)}&type=artist&limit=10`)
      return results.artists.items
    } catch (error) {
      console.error("Error searching artists:", error)
      throw error
    }
  }

  const getUserProfile = async () => {
    try {
      return await makeSpotifyRequest("/me")
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  }

  return {
    getArtistData,
    searchArtists,
    getUserProfile,
  }
}
