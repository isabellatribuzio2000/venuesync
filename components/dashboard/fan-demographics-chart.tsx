"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { Users, MapPin } from "lucide-react"

interface FanDemographicsChartProps {
  artistId: string | undefined
}

const ageData = [
  { name: "18-24", value: 35, color: "#1DB954" },
  { name: "25-34", value: 28, color: "#1E3A8A" },
  { name: "35-44", value: 20, color: "#059669" },
  { name: "45-54", value: 12, color: "#7C3AED" },
  { name: "55+", value: 5, color: "#DC2626" },
]

const locationData = [
  { city: "Los Angeles", fans: 125000 },
  { city: "New York", fans: 98000 },
  { city: "Miami", fans: 87000 },
  { city: "Chicago", fans: 76000 },
  { city: "Atlanta", fans: 65000 },
]

export function FanDemographicsChart({ artistId }: FanDemographicsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Fan Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Distribution */}
        <div>
          <h4 className="font-medium mb-3">Age Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ageData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {ageData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span>
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Top Cities
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [value.toLocaleString(), "Fans"]} />
                <Bar dataKey="fans" fill="#1DB954" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
