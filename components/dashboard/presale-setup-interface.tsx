"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Ticket, Settings, Users, Clock } from "lucide-react"
import { useState } from "react"

interface PresaleSetupInterfaceProps {
  artistId: string | undefined
}

export function PresaleSetupInterface({ artistId }: PresaleSetupInterfaceProps) {
  const [presaleEnabled, setPresaleEnabled] = useState(true)
  const [spotifyIntegration, setSpotifyIntegration] = useState(true)
  const [presalePercentage, setPresalePercentage] = useState("20")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          Presale Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spotify Integration Status */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800 dark:text-green-200">Spotify Integration Active</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Connected to Spotify for fan verification and presale access
          </p>
        </div>

        {/* Presale Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="presale-enabled">Enable Presale</Label>
              <div className="text-sm text-muted-foreground">Allow early ticket access for verified fans</div>
            </div>
            <Switch id="presale-enabled" checked={presaleEnabled} onCheckedChange={setPresaleEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="spotify-integration">Spotify Fan Verification</Label>
              <div className="text-sm text-muted-foreground">Verify fans through Spotify listening history</div>
            </div>
            <Switch id="spotify-integration" checked={spotifyIntegration} onCheckedChange={setSpotifyIntegration} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presale-percentage">Presale Allocation (%)</Label>
            <Input
              id="presale-percentage"
              type="number"
              value={presalePercentage}
              onChange={(e) => setPresalePercentage(e.target.value)}
              min="0"
              max="100"
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">Percentage of tickets available during presale</div>
          </div>
        </div>

        {/* Presale Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Eligible Fans</span>
            </div>
            <div className="text-lg font-semibold">12,450</div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Presale Window</span>
            </div>
            <div className="text-lg font-semibold">48h</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full" disabled={!presaleEnabled}>
            <Settings className="h-4 w-4 mr-2" />
            Configure Presale
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Preview Fan Experience
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">Presale integration powered by Spotify for Artists</div>
        </div>
      </CardContent>
    </Card>
  )
}
