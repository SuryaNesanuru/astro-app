'use client'

import { useState, useEffect } from 'react'
import { useChartStore } from '@/lib/store/chart-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CalendarIcon, TrendingUp, Clock, Target, Zap } from 'lucide-react'
import { format, differenceInDays, addYears, subYears } from 'date-fns'
import { cn } from '@/lib/utils'

export function TransitView() {
  const { chartData, currentDate, setCurrentDate } = useChartStore()
  const [transitDate, setTransitDate] = useState(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [transitData, setTransitData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (chartData) {
      calculateTransits()
    }
  }, [chartData, transitDate])

  const calculateTransits = async () => {
    if (!chartData) return
    
    setLoading(true)
    try {
      // Simulate transit calculation
      const transits = chartData.planets.map(planet => {
        const transitLongitude = (planet.longitude + (differenceInDays(transitDate, currentDate) * planet.dailyMotion)) % 360
        const transitHouse = Math.floor(transitLongitude / 30) + 1
        
        return {
          ...planet,
          transitLongitude,
          transitHouse,
          isRetrograde: Math.random() > 0.8, // Simulate retrograde status
          transitAspects: calculateTransitAspects(planet, chartData.planets, transitDate, currentDate)
        }
      })
      
      setTransitData({ transits, date: transitDate })
    } catch (error) {
      console.error('Error calculating transits:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTransitAspects = (transitPlanet: any, natalPlanets: any[], transitDate: Date, natalDate: Date) => {
    const aspects: any[] = []
    
    natalPlanets.forEach(natalPlanet => {
      const transitLongitude = (transitPlanet.longitude + (differenceInDays(transitDate, natalDate) * transitPlanet.dailyMotion)) % 360
      const natalLongitude = natalPlanet.longitude
      const difference = Math.abs(transitLongitude - natalLongitude)
      
      // Check for major aspects
      if (Math.abs(difference - 0) <= 8) aspects.push({ type: 'Conjunction', planet: natalPlanet.name, orb: Math.abs(difference - 0) })
      if (Math.abs(difference - 60) <= 6) aspects.push({ type: 'Sextile', planet: natalPlanet.name, orb: Math.abs(difference - 60) })
      if (Math.abs(difference - 90) <= 8) aspects.push({ type: 'Square', planet: natalPlanet.name, orb: Math.abs(difference - 90) })
      if (Math.abs(difference - 120) <= 8) aspects.push({ type: 'Trine', planet: natalPlanet.name, orb: Math.abs(difference - 120) })
      if (Math.abs(difference - 180) <= 8) aspects.push({ type: 'Opposition', planet: natalPlanet.name, orb: Math.abs(difference - 180) })
    })
    
    return aspects
  }

  const calculateProgressions = () => {
    if (!chartData) return null
    
    const age = differenceInDays(new Date(), currentDate) / 365.25
    const progressionYear = Math.floor(age)
    
    return chartData.planets.map(planet => {
      const progressedLongitude = (planet.longitude + (progressionYear * planet.dailyMotion)) % 360
      const progressedHouse = Math.floor(progressedLongitude / 30) + 1
      
      return {
        ...planet,
        progressedLongitude,
        progressedHouse,
        progressionYear
      }
    })
  }

  const progressionData = calculateProgressions()

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">No chart data available for transit analysis</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Transit Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Transit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Transit Date:</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !transitDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {transitDate ? format(transitDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={transitDate}
                    onSelect={(date) => {
                      if (date) {
                        setTransitDate(date)
                        setIsDatePickerOpen(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransitDate(subYears(transitDate, 1))}
              >
                -1 Year
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransitDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransitDate(addYears(transitDate, 1))}
              >
                +1 Year
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Transits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Current Transits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : transitData ? (
              <div className="space-y-3">
                {transitData.transits.map((transit: any) => (
                  <div key={transit.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium">{transit.name}</span>
                      {transit.isRetrograde && (
                        <Badge variant="destructive" className="text-xs">R</Badge>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <div>House {transit.transitHouse}</div>
                      <div className="text-muted-foreground">
                        {Math.floor(transit.transitLongitude)}°{Math.floor((transit.transitLongitude % 1) * 60)}'
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No transit data available</p>
            )}
          </CardContent>
        </Card>

        {/* Progressions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Secondary Progressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressionData ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Progressed to age: {progressionData[0]?.progressionYear} years
                </div>
                {progressionData.map((planet) => (
                  <div key={planet.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="font-medium">{planet.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div>House {planet.progressedHouse}</div>
                      <div className="text-muted-foreground">
                        {Math.floor(planet.progressedLongitude)}°{Math.floor((planet.progressedLongitude % 1) * 60)}'
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No progression data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transit Aspects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Transit Aspects to Natal Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transitData ? (
            <div className="space-y-3">
              {transitData.transits.flatMap((transit: any) => 
                transit.transitAspects.map((aspect: any, index: number) => (
                  <div key={`${transit.name}-${aspect.planet}-${index}`} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{transit.name}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{aspect.planet}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{aspect.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Orb: {aspect.orb.toFixed(1)}°
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No transit aspects available</p>
          )}
        </CardContent>
      </Card>

      {/* Transit Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Transit Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Upcoming major transits in the next 30 days
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-4 p-2 border rounded">
                  <div className="text-sm font-medium">
                    {format(addYears(new Date(), i), 'MMM dd')}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Saturn enters House 3</div>
                    <div className="text-sm text-muted-foreground">
                      Major transit affecting communication and siblings
                    </div>
                  </div>
                  <Badge variant="secondary">Major</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}