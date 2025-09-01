'use client'

import { useChartStore } from '@/lib/store/chart-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function AspectsTable() {
  const { aspects, vedicAspects, system } = useChartStore()

  const currentAspects = system === 'western' ? aspects : vedicAspects

  if (!currentAspects || currentAspects.length === 0) {
    return (
      <div className="border rounded-lg p-4">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">
            {system === 'western' ? 'Western Aspects' : 'Vedic Aspects'}
          </h3>
        </div>
        <p className="text-muted-foreground text-center">No aspects found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">
          {system === 'western' ? 'Western Aspects' : 'Vedic Aspects'}
        </h3>
      </div>
      
      <div className="max-h-80 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Planet 1</TableHead>
              <TableHead>Aspect</TableHead>
              <TableHead>Planet 2</TableHead>
              {system === 'western' && (
                <>
                  <TableHead>Orb</TableHead>
                  <TableHead>Type</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAspects.map((aspect, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">{aspect.planet1}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {aspect.aspect}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{aspect.planet2}</TableCell>
                {system === 'western' && (
                  <>
                    <TableCell className="font-mono text-sm">
                      {aspect.exact.toFixed(1)}°
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={aspect.applying ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {aspect.applying ? 'Applying' : 'Separating'}
                      </Badge>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}