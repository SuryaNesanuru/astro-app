'use client'

import { useState } from 'react'
import { useChartStore } from '@/lib/store/chart-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function DivisionalCharts() {
  const { chartData, system } = useChartStore()
  const [selectedVarga, setSelectedVarga] = useState('d9')

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    )
  }

  if (system !== 'vedic' && system !== 'kp') {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">Divisional charts are only available for Vedic and KP systems</p>
      </div>
    )
  }

  const vargas = [
    { key: 'd1', name: 'D1 (Rashi)', description: 'Birth Chart' },
    { key: 'd2', name: 'D2 (Hora)', description: 'Wealth & Family' },
    { key: 'd3', name: 'D3 (Drekkana)', description: 'Siblings & Courage' },
    { key: 'd4', name: 'D4 (Chaturthamsa)', description: 'Property & Fortune' },
    { key: 'd7', name: 'D7 (Saptamsa)', description: 'Children & Progeny' },
    { key: 'd9', name: 'D9 (Navamsa)', description: 'Spouse & Marriage' },
    { key: 'd10', name: 'D10 (Dasamsa)', description: 'Career & Profession' },
    { key: 'd12', name: 'D12 (Dwadasamsa)', description: 'Parents & Ancestors' },
    { key: 'd16', name: 'D16 (Shodasamsa)', description: 'Vehicles & Comforts' },
    { key: 'd20', name: 'D20 (Vimsamsa)', description: 'Spiritual Progress' },
    { key: 'd24', name: 'D24 (Chaturvimsamsa)', description: 'Education & Learning' },
    { key: 'd27', name: 'D27 (Nakshatramsa)', description: 'Nakshatra Strength' },
    { key: 'd30', name: 'D30 (Trimsamsa)', description: 'Evil Effects' },
    { key: 'd40', name: 'D40 (Chatvarimsamsa)', description: 'Maternal Relations' },
    { key: 'd45', name: 'D45 (Panchavimsamsa)', description: 'Health & Longevity' },
    { key: 'd60', name: 'D60 (Shashtiamsa)', description: 'Past Life Karma' }
  ]

  const currentVarga = vargas.find(v => v.key === selectedVarga)
  const vargaNumber = parseInt(selectedVarga.replace('d', ''))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Divisional Charts</span>
          <Badge variant="secondary">{currentVarga?.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedVarga} onValueChange={setSelectedVarga} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            {vargas.slice(0, 4).map((varga) => (
              <TabsTrigger key={varga.key} value={varga.key} className="text-xs p-2">
                {varga.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-4">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              {vargas.slice(4, 8).map((varga) => (
                <TabsTrigger key={varga.key} value={varga.key} className="text-xs p-2">
                  {varga.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="mt-4">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              {vargas.slice(8, 12).map((varga) => (
                <TabsTrigger key={varga.key} value={varga.key} className="text-xs p-2">
                  {varga.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="mt-4">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              {vargas.slice(12, 16).map((varga) => (
                <TabsTrigger key={varga.key} value={varga.key} className="text-xs p-2">
                  {varga.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">{currentVarga?.name}</h3>
            <p className="text-sm text-muted-foreground">{currentVarga?.description}</p>
          </div>

          {/* Varga Chart Display */}
          <div className="flex justify-center mb-4">
            <VargaChart vargaNumber={vargaNumber} chartData={chartData} />
          </div>

          {/* Varga Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Division Factor:</span>
                <span className="ml-2">{vargaNumber}</span>
              </div>
              <div>
                <span className="font-medium">Total Houses:</span>
                <span className="ml-2">12</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Each house in the {currentVarga?.name} represents {vargaNumber} degrees of the birth chart.</p>
              <p>This chart is particularly useful for analyzing {currentVarga?.description?.toLowerCase()}.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VargaChart({ vargaNumber, chartData }: { vargaNumber: number, chartData: any }) {
  // Calculate divisional chart positions
  const calculateVargaPositions = () => {
    if (!chartData?.planets) return []
    
    return chartData.planets.map((planet: any) => {
      const vargaLongitude = (planet.longitude * vargaNumber) % 360
      const vargaHouse = Math.floor(vargaLongitude / 30) + 1
      
      return {
        ...planet,
        vargaLongitude,
        vargaHouse
      }
    })
  }

  const vargaPlanets = calculateVargaPositions()

  // Create a simple grid representation for the varga chart
  const houses = Array.from({ length: 12 }, (_, i) => i + 1)
  const planetsInHouse = houses.map(house => 
    vargaPlanets.filter((p: any) => p.vargaHouse === house)
  )

  return (
    <div className="w-64 h-64">
      <svg width="256" height="256" viewBox="0 0 256 256" className="border rounded-lg">
        {/* Grid lines */}
        <defs>
          <pattern id="vargaGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="256" height="256" fill="url(#vargaGrid)" />
        
        {/* House numbers */}
        {houses.map((house, index) => {
          const row = Math.floor((house - 1) / 4)
          const col = (house - 1) % 4
          const x = col * 64 + 32
          const y = row * 64 + 32
          
          return (
            <g key={house}>
              {/* House number */}
              <text
                x={x}
                y={y - 20}
                textAnchor="middle"
                fontSize="12"
                fill="hsl(var(--muted-foreground))"
                className="font-medium"
              >
                {house}
              </text>
              
              {/* Planets in house */}
              {planetsInHouse[house - 1]?.map((planet: any, planetIndex: number) => (
                <g key={planet.name}>
                  <circle
                    cx={x + (planetIndex - 1) * 20}
                    cy={y + 10}
                    r="6"
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--background))"
                    strokeWidth="1"
                  />
                  <text
                    x={x + (planetIndex - 1) * 20}
                    y={y + 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8"
                    fill="hsl(var(--background))"
                    className="font-bold"
                  >
                    {planet.name.slice(0, 2)}
                  </text>
                </g>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}