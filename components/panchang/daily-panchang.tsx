'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'

import { CalendarIcon, Sun, Moon, Clock, MapPin, Info } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { cn } from '@/lib/utils'

export function DailyPanchang() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [panchangData, setPanchangData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    calculatePanchang()
  }, [selectedDate])

  const calculatePanchang = async () => {
    setLoading(true)
    try {
      // Simulate panchang calculation
      const data = {
        date: selectedDate,
        tithi: {
          name: 'Shukla Paksha Tritiya',
          number: 3,
          paksha: 'Shukla',
          completion: 75.5
        },
        nakshatra: {
          name: 'Rohini',
          number: 4,
          completion: 45.2,
          lord: 'Moon'
        },
        yoga: {
          name: 'Shubha',
          number: 6,
          completion: 30.8
        },
        karana: {
          name: 'Vishti',
          number: 6,
          completion: 60.0
        },
        sunrise: '06:15',
        sunset: '18:45',
        moonrise: '08:30',
        moonset: '21:15',
        rahuKaal: {
          start: '16:30',
          end: '18:00',
          duration: '1h 30m'
        },
        gulika: {
          start: '15:00',
          end: '16:30',
          duration: '1h 30m'
        },
        yamaganda: {
          start: '12:00',
          end: '13:30',
          duration: '1h 30m'
        },
        abhijit: {
          start: '11:45',
          end: '12:30',
          duration: '45m'
        },
        brahmaMuhurta: {
          start: '04:30',
          end: '06:00',
          duration: '1h 30m'
        }
      }
      
      setPanchangData(data)
    } catch (error) {
      console.error('Error calculating panchang:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTithiEmoji = (tithiNumber: number) => {
    if (tithiNumber <= 15) return '🌙' // Shukla Paksha
    return '🌑' // Krishna Paksha
  }

  const getNakshatraEmoji = (nakshatraNumber: number) => {
    const emojis = ['🐏', '🐂', '👫', '🦀', '🦁', '👧', '⚖️', '🦂', '🏹', '🐐', '🏺', '🐟']
    return emojis[(nakshatraNumber - 1) % 12] || '⭐'
  }

  const isAuspicious = (time: string) => {
    const currentTime = new Date()
    const [hours, minutes] = time.split(':').map(Number)
    const timeDate = new Date()
    timeDate.setHours(hours, minutes, 0, 0)
    
    const diff = Math.abs(currentTime.getTime() - timeDate.getTime())
    return diff <= 30 * 60 * 1000 // Within 30 minutes
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Daily Panchang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      setIsDatePickerOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              >
                Previous Day
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                Next Day
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {panchangData && (
        <>
          {/* Main Panchang Elements */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Tithi */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getTithiEmoji(panchangData.tithi.number)} Tithi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold mb-2">{panchangData.tithi.name}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {panchangData.tithi.paksha} Paksha
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${panchangData.tithi.completion}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {panchangData.tithi.completion.toFixed(1)}% complete
                </div>
              </CardContent>
            </Card>

            {/* Nakshatra */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getNakshatraEmoji(panchangData.nakshatra.number)} Nakshatra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold mb-2">{panchangData.nakshatra.name}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  Lord: {panchangData.nakshatra.lord}
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${panchangData.nakshatra.completion}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {panchangData.nakshatra.completion.toFixed(1)}% complete
                </div>
              </CardContent>
            </Card>

            {/* Yoga */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🧘 Yoga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold mb-2">{panchangData.yoga.name}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  Number: {panchangData.yoga.number}
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${panchangData.yoga.completion}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {panchangData.yoga.completion.toFixed(1)}% complete
                </div>
              </CardContent>
            </Card>

            {/* Karana */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">⚡ Karana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold mb-2">{panchangData.karana.name}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  Number: {panchangData.karana.number}
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${panchangData.karana.completion}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {panchangData.karana.completion.toFixed(1)}% complete
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sun and Moon Timings */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  Sun Timings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Sunrise</span>
                    <Badge variant="outline" className={cn(isAuspicious(panchangData.sunrise) && "bg-green-100 text-green-800")}>
                      {panchangData.sunrise}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Sunset</span>
                    <Badge variant="outline" className={cn(isAuspicious(panchangData.sunset) && "bg-red-100 text-red-800")}>
                      {panchangData.sunset}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Day length: {panchangData.sunset} - {panchangData.sunrise} = 12h 30m
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-blue-600" />
                  Moon Timings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Moonrise</span>
                    <Badge variant="outline" className={cn(isAuspicious(panchangData.moonrise) && "bg-blue-100 text-blue-800")}>
                      {panchangData.moonrise}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Moonset</span>
                    <Badge variant="outline" className={cn(isAuspicious(panchangData.moonset) && "bg-purple-100 text-purple-800")}>
                      {panchangData.moonset}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Moon visible: {panchangData.moonset} - {panchangData.moonrise} = 12h 45m
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auspicious and Inauspicious Timings */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Auspicious Timings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded bg-green-50 dark:bg-green-950">
                    <span className="font-medium">Brahma Muhurta</span>
                    <Badge variant="secondary">
                      {panchangData.brahmaMuhurta.start} - {panchangData.brahmaMuhurta.end}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded bg-green-50 dark:bg-green-950">
                    <span className="font-medium">Abhijit Muhurta</span>
                    <Badge variant="secondary">
                      {panchangData.abhijit.start} - {panchangData.abhijit.end}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    These are the most auspicious times for spiritual activities and important decisions.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  Inauspicious Timings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded bg-red-50 dark:bg-red-950">
                    <span className="font-medium">Rahu Kaal</span>
                    <Badge variant="destructive">
                      {panchangData.rahuKaal.start} - {panchangData.rahuKaal.end}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded bg-red-50 dark:bg-red-950">
                    <span className="font-medium">Gulika Kaal</span>
                    <Badge variant="destructive">
                      {panchangData.gulika.start} - {panchangData.gulika.end}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded bg-red-50 dark:bg-red-950">
                    <span className="font-medium">Yamaganda</span>
                    <Badge variant="destructive">
                      {panchangData.yamaganda.start} - {panchangData.yamaganda.end}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avoid starting new ventures during these periods.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Daily Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Today's Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Best time for meditation: {panchangData.brahmaMuhurta.start}</li>
                    <li>• Avoid travel during: {panchangData.rahuKaal.start} - {panchangData.rahuKaal.end}</li>
                    <li>• Good for business: {panchangData.abhijit.start} - {panchangData.abhijit.end}</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Astrological Notes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {panchangData.tithi.name} is favorable for spiritual activities</li>
                    <li>• {panchangData.nakshatra.name} nakshatra enhances creativity</li>
                    <li>• {panchangData.yoga.name} yoga brings positive energy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}