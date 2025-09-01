'use client'

import { useState } from 'react'
import { useChartStore } from '@/lib/store/chart-store'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, MapPin, Printer, Settings, Globe, Palette } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

export function ChartToolbar() {
  const {
    system,
    ayanamsha,
    houseSystem,
    chartStyle,
    currentDate,
    setSystem,
    setAyanamsha,
    setHouseSystem,
    setChartStyle,
    setCurrentDate
  } = useChartStore()
  
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleSaveChart = () => {
    // TODO: Implement save chart functionality
    console.log('Saving chart...')
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* System Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">System:</Label>
            <Select value={system} onValueChange={setSystem}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vedic">Vedic</SelectItem>
                <SelectItem value="western">Western</SelectItem>
                <SelectItem value="kp">KP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ayanamsha Selection (for Vedic/KP) */}
          {(system === 'vedic' || system === 'kp') && (
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Ayanamsha:</Label>
              <Select value={ayanamsha} onValueChange={setAyanamsha}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lahiri">Lahiri</SelectItem>
                  <SelectItem value="raman">Raman</SelectItem>
                  <SelectItem value="krishnamurti">Krishnamurti</SelectItem>
                  <SelectItem value="yukteshwar">Yukteshwar</SelectItem>
                  <SelectItem value="pushya">Pushya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* House System Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Houses:</Label>
            <Select value={houseSystem} onValueChange={setHouseSystem}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placidus">Placidus</SelectItem>
                <SelectItem value="wholehouse">Whole House</SelectItem>
                <SelectItem value="koch">Koch</SelectItem>
                <SelectItem value="porphyrius">Porphyrius</SelectItem>
                <SelectItem value="equal">Equal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chart Style Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Style:</Label>
            <Select value={chartStyle} onValueChange={setChartStyle}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North Indian</SelectItem>
                <SelectItem value="south">South Indian</SelectItem>
                <SelectItem value="wheel">Western Wheel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Date:</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 justify-start text-left font-normal",
                    !currentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentDate ? format(currentDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => {
                    if (date) {
                      setCurrentDate(date)
                      setIsDatePickerOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="en" onValueChange={(value) => {
              // TODO: Implement language switching
              console.log('Language changed to:', value)
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="hi">HI</SelectItem>
                <SelectItem value="te">TE</SelectItem>
                <SelectItem value="ta">TA</SelectItem>
                <SelectItem value="kn">KN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleSaveChart}>
              <Settings className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
                          <Printer className="h-4 w-4 mr-2" />
            Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}