'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import useMeasure from 'react-use-measure'
import { useChartStore } from '@/lib/store/chart-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'

export function EnhancedChartWheel() {
  const { chartData, aspects, system, chartStyle, selectedPlanet, setSelectedPlanet } = useChartStore()
  const [ref, bounds] = useMeasure()
  const svgRef = useRef<SVGSVGElement>(null)
  
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showAspects, setShowAspects] = useState(true)
  const [showHouses, setShowHouses] = useState(true)

  const chartDimensions = useMemo(() => {
    const size = Math.min(bounds.width, bounds.height) || 400
    const centerX = size / 2
    const centerY = size / 2
    const radius = (size * 0.4) * zoom
    const innerRadius = radius * 0.6
    
    return { size, centerX, centerY, radius, innerRadius }
  }, [bounds.width, bounds.height, zoom])

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]

  const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

  const planetSymbols: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
    'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇',
    'Rahu': '☊', 'Ketu': '☋'
  }

  const planetColors: Record<string, string> = {
    'Sun': '#FFD700', 'Moon': '#C0C0C0', 'Mercury': '#87CEEB', 'Venus': '#FFB6C1',
    'Mars': '#FF6347', 'Jupiter': '#DDA0DD', 'Saturn': '#B0C4DE', 'Uranus': '#98FB98',
    'Neptune': '#F0E68C', 'Pluto': '#D2B48C', 'Rahu': '#800080', 'Ketu': '#4B0082'
  }

  const getPlanetPosition = (planet: any) => {
    const { centerX, centerY, radius } = chartDimensions
    const angle = ((planet.longitude + rotation - 90) * Math.PI) / 180
    const planetRadius = radius * 0.8
    
    return {
      x: centerX + planetRadius * Math.cos(angle),
      y: centerY + planetRadius * Math.sin(angle),
      angle: angle
    }
  }

  const getHousePosition = (houseNumber: number) => {
    const { centerX, centerY, radius } = chartDimensions
    const angle = ((houseNumber - 1) * 30 + rotation - 90) * Math.PI / 180
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle: angle
    }
  }

  const getAspectLine = (planet1: any, planet2: any, aspectType: string) => {
    const pos1 = getPlanetPosition(planet1)
    const pos2 = getPlanetPosition(planet2)
    
    return {
      x1: pos1.x,
      y1: pos1.y,
      x2: pos2.x,
      y2: pos2.y,
      type: aspectType
    }
  }

  const handlePlanetClick = (planetName: string) => {
    setSelectedPlanet(selectedPlanet === planetName ? null : planetName)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  if (!chartData) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No chart data available</p>
        </CardContent>
      </Card>
    )
  }

  const { size, centerX, centerY, radius, innerRadius } = chartDimensions

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Chart Visualization</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHouses(!showHouses)}
            >
              {showHouses ? 'Hide' : 'Show'} Houses
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAspects(!showAspects)}
            >
              {showAspects ? 'Hide' : 'Show'} Aspects
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="w-full h-96 flex items-center justify-center">
          <svg
            ref={svgRef}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="border rounded-lg"
          >
            {/* Background circles */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.2"
            />

            {/* Zodiac signs */}
            {zodiacSigns.map((sign, index) => {
              const angle = (index * 30 + rotation - 90) * Math.PI / 180
              const x = centerX + (radius + 20) * Math.cos(angle)
              const y = centerY + (radius + 20) * Math.sin(angle)
              
              return (
                <g key={sign}>
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="16"
                    fill="hsl(var(--muted-foreground))"
                    className="font-bold"
                  >
                    {signSymbols[index]}
                  </text>
                  <text
                    x={x}
                    y={y + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {sign}
                  </text>
                </g>
              )
            })}

            {/* House divisions */}
            {showHouses && Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 + rotation - 90) * Math.PI / 180
              const x1 = centerX + innerRadius * Math.cos(angle)
              const y1 = centerY + innerRadius * Math.sin(angle)
              const x2 = centerX + radius * Math.cos(angle)
              const y2 = centerY + radius * Math.sin(angle)

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  {/* House numbers */}
                  <text
                    x={centerX + (radius - 30) * Math.cos(angle + Math.PI / 12)}
                    y={centerY + (radius - 30) * Math.sin(angle + Math.PI / 12)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fill="hsl(var(--muted-foreground))"
                    className="font-medium"
                  >
                    {i + 1}
                  </text>
                </g>
              )
            })}

            {/* Aspect lines */}
            {showAspects && aspects?.map((aspect: any, index: number) => {
              const planet1 = chartData.planets.find((p: any) => p.name === aspect.planet1)
              const planet2 = chartData.planets.find((p: any) => p.name === aspect.planet2)
              
              if (!planet1 || !planet2) return null
              
              const line = getAspectLine(planet1, planet2, aspect.aspect)
              const strokeColor = getAspectColor(aspect.aspect)
              const strokeWidth = getAspectWidth(aspect.aspect)
              
              return (
                <line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  opacity="0.6"
                  strokeDasharray={aspect.aspect === 'Opposition' ? '5,5' : 'none'}
                />
              )
            })}

            {/* Planets */}
            {chartData.planets?.map((planet) => {
              const position = getPlanetPosition(planet)
              const isSelected = selectedPlanet === planet.name
              const planetColor = planetColors[planet.name] || 'hsl(var(--primary))'
              
              return (
                <g key={planet.name}>
                  {/* Planet symbol background */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="12"
                    fill={isSelected ? planetColor : 'hsl(var(--background))'}
                    stroke={planetColor}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="cursor-pointer hover:stroke-2"
                    onClick={() => handlePlanetClick(planet.name)}
                  />
                  
                  {/* Planet symbol */}
                  <text
                    x={position.x}
                    y={position.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="14"
                    fill={isSelected ? 'white' : planetColor}
                    className="font-bold cursor-pointer"
                    onClick={() => handlePlanetClick(planet.name)}
                  >
                    {planetSymbols[planet.name] || planet.name.slice(0, 2)}
                  </text>
                  
                  {/* Planet name */}
                  <text
                    x={position.x}
                    y={position.y + 25}
                    textAnchor="middle"
                    fontSize="10"
                    fill="hsl(var(--foreground))"
                    className="font-medium"
                  >
                    {planet.name}
                  </text>
                  
                  {/* Planet details on hover/select */}
                  {isSelected && (
                    <g>
                      <rect
                        x={position.x + 15}
                        y={position.y - 30}
                        width="120"
                        height="60"
                        fill="hsl(var(--background))"
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x={position.x + 20}
                        y={position.y - 15}
                        fontSize="10"
                        fill="hsl(var(--foreground))"
                        className="font-medium"
                      >
                        {planet.name}
                      </text>
                      <text
                        x={position.x + 20}
                        y={position.y - 5}
                        fontSize="9"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {planet.sign} {Math.floor(planet.longitude)}°{Math.floor((planet.longitude % 1) * 60)}'
                      </text>
                      <text
                        x={position.x + 20}
                        y={position.y + 5}
                        fontSize="9"
                        fill="hsl(var(--muted-foreground))"
                      >
                        House {planet.house}
                      </text>
                      {(planet as any).isRetrograde && (
                        <text
                          x={position.x + 20}
                          y={position.y + 15}
                          fontSize="9"
                          fill="hsl(var(--destructive))"
                          className="font-bold"
                        >
                          Retrograde
                        </text>
                      )}
                    </g>
                  )}
                </g>
              )
            })}

            {/* Center point */}
            <circle
              cx={centerX}
              cy={centerY}
              r="3"
              fill="hsl(var(--primary))"
            />
          </svg>
        </div>

        {/* Chart legend */}
        <div className="mt-4 p-3 border rounded-lg bg-muted/50">
          <div className="text-sm font-medium mb-2">Chart Legend</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Planets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Conjunctions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Trines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Squares</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getAspectColor(aspect: string): string {
  switch (aspect) {
    case 'Conjunction': return '#3B82F6'
    case 'Sextile': return '#10B981'
    case 'Square': return '#EF4444'
    case 'Trine': return '#059669'
    case 'Opposition': return '#DC2626'
    default: return '#6B7280'
  }
}

function getAspectWidth(aspect: string): number {
  switch (aspect) {
    case 'Conjunction': return 3
    case 'Opposition': return 2
    default: return 1
  }
}