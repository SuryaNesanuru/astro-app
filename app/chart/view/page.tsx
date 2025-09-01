'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChartStore } from '@/lib/store/chart-store'
import { ChartToolbar } from '@/components/chart/chart-toolbar'
import { ChartWheel } from '@/components/chart/chart-wheel'
import { DashaTree } from '@/components/chart/dasha-tree'
import { PlanetaryPositions } from '@/components/chart/planetary-positions'
import { AspectsTable } from '@/components/chart/aspects-table'
import { KPSignificators } from '@/components/chart/kp-significators'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ChartView() {
  const { chartData, loading } = useChartStore()
  const router = useRouter()

  useEffect(() => {
    if (!chartData && !loading) {
      router.push('/chart/new')
    }
  }, [chartData, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Calculating chart...</p>
        </div>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <ChartToolbar />
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Left Panel - Chart Wheel */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <ChartWheel />
          </CardContent>
        </Card>

        {/* Middle Panel - Dasha Tree */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <DashaTree />
          </CardContent>
        </Card>

        {/* Right Panel - Data Tables */}
        <div className="lg:col-span-1 space-y-4">
          <Tabs defaultValue="positions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="aspects">Aspects</TabsTrigger>
              <TabsTrigger value="kp">KP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="positions" className="mt-4">
              <PlanetaryPositions />
            </TabsContent>
            
            <TabsContent value="aspects" className="mt-4">
              <AspectsTable />
            </TabsContent>
            
            <TabsContent value="kp" className="mt-4">
              <KPSignificators />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}