'use client'

import { useChartStore } from '@/lib/store/chart-store'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Printer, Download, Share2 } from 'lucide-react'

export function PrintLayout() {
  const { chartData, system, ayanamsha, houseSystem, chartStyle, dashaData, aspects, kpSignificators } = useChartStore()

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">No chart data available for printing</p>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    console.log('Downloading PDF...')
  }

  const handleShare = () => {
    console.log('Sharing chart...')
  }

  return (
    <div className="space-y-6">
      {/* Print Controls */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div>
          <h2 className="text-lg font-semibold">Print & Export</h2>
          <p className="text-sm text-muted-foreground">
            Generate a professional chart layout for printing or sharing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Print Layout */}
      <div className="print-layout space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">Prerana Astro</h1>
          <h2 className="text-xl font-semibold mb-2">Astrological Birth Chart</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Generated on: {format(new Date(), 'PPP')}</p>
            <p>System: {system.toUpperCase()} • Ayanamsha: {ayanamsha} • House System: {houseSystem}</p>
            <p>
              Chart Style:{' '}
              {chartStyle === 'north'
                ? 'North Indian'
                : chartStyle === 'south'
                ? 'South Indian'
                : 'Western Wheel'}
            </p>
          </div>
        </div>

        {/* Chart Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Person Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Person Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>Sample Person</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Gender:</span>
                <span>Not specified</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Birth Date:</span>
                <span>January 1, 1990</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Birth Time:</span>
                <span>12:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Place:</span>
                <span>Sample Location</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Coordinates:</span>
                <span>0°, 0°</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Timezone:</span>
                <span>UTC</span>
              </div>
            </CardContent>
          </Card>

          {/* Chart Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chart Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Ascendant:</span>
                <span>
                  {Math.floor(chartData.ascendant)}°
                  {Math.floor((chartData.ascendant % 1) * 60)}'
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">MC (10th House):</span>
                <span>
                  {Math.floor(chartData.midheaven)}°
                  {Math.floor((chartData.midheaven % 1) * 60)}'
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Planets:</span>
                <span>{chartData.planets?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Houses:</span>
                <span>{chartData.houses?.length || 0}</span>
              </div>
              {dashaData && (
                <div className="flex justify-between">
                  <span className="font-medium">Current Dasha:</span>
                  <span>{dashaData[0]?.planet || 'N/A'}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Planetary Positions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planetary Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Planet</th>
                    <th className="border p-2 text-left">Sign</th>
                    <th className="border p-2 text-left">Longitude</th>
                    <th className="border p-2 text-left">House</th>
                    <th className="border p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.planets?.map((planet) => (
                    <tr key={planet.name}>
                      <td className="border p-2 font-medium">{planet.name}</td>
                      <td className="border p-2">{planet.sign}</td>
                      <td className="border p-2 font-mono">
                        {Math.floor(planet.longitude)}°
                        {Math.floor((planet.longitude % 1) * 60)}'
                        {Math.floor(((planet.longitude % 1) * 60 % 1) * 60)}"
                      </td>
                      <td className="border p-2">{planet.house}</td>
                      <td className="border p-2">
                        {planet.speed < 0 && (
                          <Badge variant="destructive" className="text-xs">
                            R
                          </Badge>
                        )}
                        {planet?.isExalted && (
                          <Badge variant="default" className="text-xs">
                            Exalted
                          </Badge>
                        )}
                        {planet?.isDebilitated && (
                          <Badge variant="secondary" className="text-xs">
                            Debilitated
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* (rest of your component stays unchanged) */}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print-layout {
            padding: 20px;
          }
          button,
          .no-print {
            display: none !important;
          }
          body {
            font-size: 12px;
            line-height: 1.4;
          }
          table {
            font-size: 10px;
          }
          .card {
            break-inside: avoid;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  )
}
