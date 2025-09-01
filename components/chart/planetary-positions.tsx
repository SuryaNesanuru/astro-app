'use client'

import { useChartStore } from '@/lib/store/chart-store'
import { SIGNS, formatDegree } from '@/lib/calculations/ephemeris'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function PlanetaryPositions() {
  const { chartData, system, selectedPlanet, setSelectedPlanet } = useChartStore()

  if (!chartData) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">No planetary data available</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Planetary Positions</h3>
      </div>
      
      <div className="max-h-80 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Planet</TableHead>
              <TableHead>Sign</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>House</TableHead>
              {system !== 'western' && <TableHead>Nakshatra</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartData.planets.map((planet) => {
              const sign = SIGNS[planet.sign!]
              const nakshatra = Math.floor((planet.longitude % 360) / (360 / 27)) + 1
              const isSelected = selectedPlanet === planet.name
              
              return (
                <TableRow
                  key={planet.name}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    isSelected ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => setSelectedPlanet(isSelected ? null : planet.name)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {planet.name}
                      {planet.speed < 0 && (
                        <Badge variant="secondary" className="text-xs">R</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{sign}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatDegree(planet.longitude)}
                  </TableCell>
                  <TableCell>{planet.house}</TableCell>
                  {system !== 'western' && (
                    <TableCell>{nakshatra}</TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}