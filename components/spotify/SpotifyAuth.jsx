"use client"

import { useSpotifyAuth } from "@/hooks/useSpotifyAuth"

export default function SpotifyAuth() {
  const { isAuthenticated, user, loginWithSpotify, logout } = useSpotifyAuth()

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400">Connected to Spotify</span>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={loginWithSpotify}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.859-.179-.98-.597-.122-.418.18-.86.599-.98 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02l.022.138zm1.440-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56z" />
      </svg>
      <span>Connect Spotify</span>
    </button>
  )
}
