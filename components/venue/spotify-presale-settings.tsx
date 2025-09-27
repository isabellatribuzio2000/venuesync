"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Music, Users, Clock, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

interface SpotifyPresaleSettingsProps {
  venueId: string | undefined
}

export function SpotifyPresaleSettings({ venueId }: SpotifyPresaleSettingsProps) {
  const [presaleEnabled, setPresaleEnabled] = useState(true)
  const [fanVerification, setFanVerification] = useState(true)
  const [presaleWindow, setPresaleWindow] = useState([48])
  const [presaleAllocation, setPresaleAllocation] = useState([25])
  const [minimumListens, setMinimumListens] = useState("10")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Spotify Presale Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Integration Status */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium text-green-800 dark:text-green-200">Spotify Integration Connected</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Access to Spotify fan data and listening history for presale verification
          </p>
        </div>

        {/* Presale Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="presale-enabled">Enable Spotify Presales</Label>
            <div className="text-sm text-muted-foreground">Allow verified Spotify fans early ticket access</div>
          </div>
          <Switch id="presale-enabled" checked={presaleEnabled} onCheckedChange={setPresaleEnabled} />
        </div>

        {presaleEnabled && (
          <>
            {/* Fan Verification */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fan-verification">Fan Verification</Label>
                <div className="text-sm text-muted-foreground">Verify fans through Spotify listening history</div>
              </div>
              <Switch id="fan-verification" checked={fanVerification} onCheckedChange={setFanVerification} />
            </div>

            {/* Minimum Listens */}
            {fanVerification && (
              <div className="space-y-2">
                <Label htmlFor="minimum-listens">Minimum Artist Listens</Label>
                <Input
                  id="minimum-listens"
                  type="number"
                  value={minimumListens}
                  onChange={(e) => setMinimumListens(e.target.value)}
                  min="1"
                  max="100"
                />
                <div className="text-sm text-muted-foreground">
                  Minimum number of times a fan must have listened to the artist
                </div>
              </div>
            )}

            {/* Presale Window */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Presale Window Duration</Label>
                <Badge variant="outline">{presaleWindow[0]} hours</Badge>
              </div>
              <Slider
                value={presaleWindow}
                onValueChange={setPresaleWindow}
                max={168}
                min={12}
                step={12}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">How long before general sale the presale should run</div>
            </div>

            {/* Presale Allocation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Presale Ticket Allocation</Label>
                <Badge variant="outline">{presaleAllocation[0]}%</Badge>
              </div>
              <Slider
                value={presaleAllocation}
                onValueChange={setPresaleAllocation}
                max={50}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">Percentage of total tickets available during presale</div>
            </div>

            {/* Presale Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Eligible Fans</span>
                </div>
                <div className="text-lg font-semibold">8,750</div>
                <div className="text-xs text-muted-foreground">Based on listening data</div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Avg. Conversion</span>
                </div>
                <div className="text-lg font-semibold">68%</div>
                <div className="text-xs text-muted-foreground">Presale to purchase rate</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save Presale Settings
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Test Fan Verification
              </Button>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">Presale system powered by Spotify for Artists API</div>
        </div>
      </CardContent>
    </Card>
  )
}
