'use client'

import { useChartStore } from '@/lib/store/chart-store'
import { SIGNS } from '@/lib/calculations/ephemeris'

export function ChartWheel() {
  const { chartData, system, chartStyle, selectedPlanet, selectedHouse, setSelectedPlanet, setSelectedHouse } = useChartStore()

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-96 border rounded-lg">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    )
  }

  if (chartStyle === 'wheel') {
    return <WesternWheel />
  }

  return chartStyle === 'north' ? <NorthIndianChart /> : <SouthIndianChart />
}

function WesternWheel() {
  const { chartData } = useChartStore()
  
  if (!chartData) return null

  const centerX = 200
  const centerY = 200
  const radius = 180
  const innerRadius = 120

  return (
    <div className="w-full h-96 flex items-center justify-center">
      <svg width="400" height="400" viewBox="0 0 400 400" className="border rounded-lg">
        {/* Outer circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        
        {/* Inner circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />

        {/* House lines */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x1 = centerX + innerRadius * Math.cos(angle)
          const y1 = centerY + innerRadius * Math.sin(angle)
          const x2 = centerX + radius * Math.cos(angle)
          const y2 = centerY + radius * Math.sin(angle)

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          )
        })}

        {/* House numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = ((i * 30) + 15 - 90) * (Math.PI / 180)
          const x = centerX + (radius - 20) * Math.cos(angle)
          const y = centerY + (radius - 20) * Math.sin(angle)

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fill="hsl(var(--muted-foreground))"
            >
              {i + 1}
            </text>
          )
        })}

        {/* Planets */}
        {chartData.planets.map((planet, index) => {
          const angle = (planet.longitude - 90) * (Math.PI / 180)
          const planetRadius = innerRadius + 30
          const x = centerX + planetRadius * Math.cos(angle)
          const y = centerY + planetRadius * Math.sin(angle)

          return (
            <g key={planet.name}>
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="cursor-pointer hover:fill-hsl(var(--primary)/0.8)"
              />
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--foreground))"
                className="cursor-pointer"
              >
                {planet.name.slice(0, 2)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function NorthIndianChart() {
  const { chartData } = useChartStore()
  
  if (!chartData) return null

  // North Indian chart is a diamond shape divided into 12 houses
  const houses = [
    // House positions in North Indian style
    { x: 150, y: 50, width: 100, height: 50, house: 1 },
    { x: 250, y: 50, width: 100, height: 100, house: 2 },
    { x: 250, y: 150, width: 100, height: 100, house: 3 },
    { x: 250, y: 250, width: 100, height: 50, house: 4 },
    { x: 150, y: 250, width: 100, height: 50, house: 5 },
    { x: 50, y: 250, width: 100, height: 100, house: 6 },
    { x: 50, y: 150, width: 100, height: 100, house: 7 },
    { x: 50, y: 50, width: 100, height: 100, house: 8 },
    { x: 100, y: 100, width: 100, height: 100, house: 9 },
    { x: 200, y: 100, width: 100, height: 100, house: 10 },
    { x: 200, y: 200, width: 100, height: 100, house: 11 },
    { x: 100, y: 200, width: 100, height: 100, house: 12 },
  ]

  return (
    <div className="w-full h-96 flex items-center justify-center">
      <svg width="400" height="350" viewBox="0 0 400 350" className="border rounded-lg">
        {houses.map((house) => {
          const planetsInHouse = chartData.planets.filter(p => p.house === house.house)
          
          return (
            <g key={house.house}>
              {/* House rectangle */}
              <rect
                x={house.x}
                y={house.y}
                width={house.width}
                height={house.height}
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                className="cursor-pointer hover:fill-hsl(var(--muted))"
              />
              
              {/* House number */}
              <text
                x={house.x + 5}
                y={house.y + 15}
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
              >
                {house.house}
              </text>
              
              {/* Planets in house */}
              {planetsInHouse.map((planet, index) => (
                <text
                  key={planet.name}
                  x={house.x + 10}
                  y={house.y + 30 + (index * 15)}
                  fontSize="12"
                  fill="hsl(var(--primary))"
                  className="font-medium cursor-pointer hover:fill-hsl(var(--primary)/0.8)"
                >
                  {planet.name.slice(0, 2)}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function SouthIndianChart() {
  const { chartData } = useChartStore()
  
  if (!chartData) return null

  // South Indian chart is a square grid
  const houses = [
    { x: 100, y: 50, house: 1 }, { x: 200, y: 50, house: 2 }, { x: 300, y: 50, house: 3 },
    { x: 300, y: 150, house: 4 }, { x: 300, y: 250, house: 5 }, { x: 200, y: 250, house: 6 },
    { x: 100, y: 250, house: 7 }, { x: 50, y: 250, house: 8 }, { x: 50, y: 150, house: 9 },
    { x: 50, y: 50, house: 10 }, { x: 100, y: 150, house: 11 }, { x: 200, y: 150, house: 12 }
  ]

  return (
    <div className="w-full h-96 flex items-center justify-center">
      <svg width="400" height="350" viewBox="0 0 400 350" className="border rounded-lg">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="400" height="350" fill="url(#grid)" />
        
        {houses.map((house) => {
          const planetsInHouse = chartData.planets.filter(p => p.house === house.house)
          
          return (
            <g key={house.house}>
              {/* House square */}
              <rect
                x={house.x}
                y={house.y}
                width="100"
                height="100"
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="cursor-pointer hover:fill-hsl(var(--muted))"
              />
              
              {/* House number */}
              <text
                x={house.x + 5}
                y={house.y + 15}
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
              >
                {house.house}
              </text>
              
              {/* Planets in house */}
              {planetsInHouse.map((planet, index) => (
                <text
                  key={planet.name}
                  x={house.x + 10}
                  y={house.y + 30 + (index * 15)}
                  fontSize="12"
                  fill="hsl(var(--primary))"
                  className="font-medium cursor-pointer hover:fill-hsl(var(--primary)/0.8)"
                >
                  {planet.name}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}