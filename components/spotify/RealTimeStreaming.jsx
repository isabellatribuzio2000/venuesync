"use client"

import { useState, useEffect } from "react"

export default function RealTimeStreaming({ artistData }) {
  const [realTimeData, setRealTimeData] = useState(null)

  useEffect(() => {
    if (!artistData) return

    // Initialize with base data
    const baseStreams = artistData.realTimeData?.currentStreams || artistData.followers?.total || 1000000
    setRealTimeData({
      currentStreams: baseStreams,
      timestamp: new Date(),
      trending: "up",
      dailyGrowth: (Math.random() * 5).toFixed(1),
    })

    // Update every 5 seconds
    const interval = setInterval(() => {
      setRealTimeData((prev) => {
        const variance = Math.floor(Math.random() * 10000) - 5000
        return {
          currentStreams: baseStreams + variance,
          timestamp: new Date(),
          trending: variance > 0 ? "up" : "down",
          dailyGrowth: (Math.random() * 5).toFixed(1),
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [artistData])

  if (!realTimeData) return null

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Live Streaming Data</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Current Streams</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">{realTimeData.currentStreams?.toLocaleString()}</span>
            <div className={`flex items-center ${realTimeData.trending === "up" ? "text-green-400" : "text-red-400"}`}>
              {realTimeData.trending === "up" ? "↗" : "↘"}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Daily Growth</span>
          <span className="text-green-400">+{realTimeData.dailyGrowth}%</span>
        </div>

        <div className="text-xs text-gray-500">Last updated: {realTimeData.timestamp?.toLocaleTimeString()}</div>
      </div>
    </div>
  )
}
