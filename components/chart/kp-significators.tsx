'use client'

import { useChartStore } from '@/lib/store/chart-store'
import { KP_HOUSE_MEANINGS } from '@/lib/calculations/kp'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function KPSignificators() {
  const { kpSignificators, kpSubLords, system } = useChartStore()

  if (system !== 'kp') {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          KP Significators are only available in KP system
        </p>
      </div>
    )
  }

  if (!kpSignificators || !kpSubLords) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center">No KP data available</p>
      </div>
    )
  }

  return (
    <Card className="border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">KP Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="significators" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="significators">Significators</TabsTrigger>
            <TabsTrigger value="sublords">Sub Lords</TabsTrigger>
          </TabsList>
          
          <TabsContent value="significators" className="mt-4">
            <div className="max-h-64 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>House</TableHead>
                    <TableHead>Significators</TableHead>
                    <TableHead>Meaning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpSignificators.map((sig) => {
                    const houseMeaning = KP_HOUSE_MEANINGS.find(h => h.house === sig.house)
                    return (
                      <TableRow key={sig.house} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{sig.house}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {sig.planets.map((planet) => (
                              <Badge key={planet} variant="secondary" className="text-xs">
                                {planet}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {houseMeaning?.meaning}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="sublords" className="mt-4">
            <div className="max-h-64 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Planet</TableHead>
                    <TableHead>Star Lord</TableHead>
                    <TableHead>Sub Lord</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpSubLords.map((sub) => (
                    <TableRow key={sub.planet} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{sub.planet}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.starLord}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{sub.subLord}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}