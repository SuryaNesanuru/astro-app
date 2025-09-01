'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Clock } from 'lucide-react'
import { useChartStore } from '@/lib/store/chart-store'
import { DashaPeriod, getCurrentDashaPath } from '@/lib/calculations/dasha'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export function DashaTree() {
  const { dashaData, currentDate } = useChartStore()
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  if (!dashaData) {
    return (
      <div className="h-96 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">No dasha data available</p>
      </div>
    )
  }

  const currentPath = getCurrentDashaPath(dashaData, currentDate)
  const currentPathIds = new Set(currentPath.map(p => `${p.planet}-${p.startDate.getTime()}`))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const DashaNode = ({ dasha, level = 0 }: { dasha: DashaPeriod; level?: number }) => {
    const nodeId = `${dasha.planet}-${dasha.startDate.getTime()}`
    const isExpanded = expandedNodes.has(nodeId)
    const isCurrent = currentPathIds.has(nodeId)
    const hasChildren = dasha.children && dasha.children.length > 0
    const isRunning = currentDate >= dasha.startDate && currentDate <= dasha.endDate

    const levelNames = ['Maha', 'Bhukti', 'Antar', 'Sukshma']
    const levelName = levelNames[level] || ''

    return (
      <div className={`${level > 0 ? 'ml-4 border-l pl-2' : ''}`}>
        <div
          className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer
            ${isCurrent ? 'bg-primary/10 border border-primary/20' : ''}
            ${isRunning ? 'ring-2 ring-primary/50' : ''}
          `}
          onClick={() => hasChildren && toggleNode(nodeId)}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <div className="w-4" />
            )}
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {dasha.planet}
                </span>
                {isRunning && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Current
                  </Badge>
                )}
                {levelName && (
                  <Badge variant="outline" className="text-xs">
                    {levelName}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(dasha.startDate)} - {formatDate(dasha.endDate)}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {Math.round((dasha.endDate.getTime() - dasha.startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000) * 100) / 100}y
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">
            {dasha.children!.map((childDasha, index) => (
              <DashaNode
                key={`${childDasha.planet}-${childDasha.startDate.getTime()}`}
                dasha={childDasha}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-96 border rounded-lg">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Vimshottari Dasha</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Auto-expand current path
              const newExpanded = new Set<string>()
              currentPath.forEach(p => {
                newExpanded.add(`${p.planet}-${p.startDate.getTime()}`)
              })
              setExpandedNodes(newExpanded)
            }}
          >
            Show Current
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-80">
        <div className="p-2">
          {dashaData.map((dasha) => (
            <DashaNode
              key={`${dasha.planet}-${dasha.startDate.getTime()}`}
              dasha={dasha}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}