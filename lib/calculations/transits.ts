import { PlanetPosition, ChartData, calculateChart } from './ephemeris'
import { DashaPeriod, getCurrentDashaPath } from './dasha'

export interface TransitData {
  date: Date
  planets: PlanetPosition[]
  natalPlanets: PlanetPosition[]
  significantAspects: TransitAspect[]
  dashaLord: string
  bhuktiLord: string
}

export interface TransitAspect {
  transitPlanet: string
  natalPlanet: string
  aspect: string
  orb: number
  exact: boolean
  influence: 'positive' | 'negative' | 'neutral'
}

export interface ProgressedChart {
  progressedDate: Date
  ageInYears: number
  planets: PlanetPosition[]
  houses: any[]
  significantProgressions: Progression[]
}

export interface Progression {
  planet: string
  type: 'conjunction' | 'opposition' | 'square' | 'trine' | 'sextile'
  natalPosition: number
  progressedPosition: number
  exactDate: Date
}

export async function calculateTransits(
  natalChart: ChartData,
  targetDate: Date,
  system: 'vedic' | 'western' | 'kp' = 'vedic'
): Promise<TransitData> {
  // Calculate current planetary positions
  const currentChart = await calculateChart(
    targetDate,
    75.8577, // Default coordinates - should be from natal chart
    26.9124,
    system,
    'lahiri'
  )

  // Find significant transit aspects
  const significantAspects: TransitAspect[] = []
  
  for (const transitPlanet of currentChart.planets) {
    for (const natalPlanet of natalChart.planets) {
      const angle = Math.abs(transitPlanet.longitude - natalPlanet.longitude)
      const normalizedAngle = angle > 180 ? 360 - angle : angle
      
      // Check for major aspects with tight orbs
      const aspects = [
        { name: 'conjunction', angle: 0, orb: 3 },
        { name: 'sextile', angle: 60, orb: 2 },
        { name: 'square', angle: 90, orb: 3 },
        { name: 'trine', angle: 120, orb: 3 },
        { name: 'opposition', angle: 180, orb: 3 }
      ]
      
      for (const aspectData of aspects) {
        const orb = Math.abs(normalizedAngle - aspectData.angle)
        if (orb <= aspectData.orb) {
          significantAspects.push({
            transitPlanet: transitPlanet.name,
            natalPlanet: natalPlanet.name,
            aspect: aspectData.name,
            orb: orb,
            exact: orb < 0.5,
            influence: getAspectInfluence(aspectData.name, transitPlanet.name, natalPlanet.name)
          })
        }
      }
    }
  }

  return {
    date: targetDate,
    planets: currentChart.planets,
    natalPlanets: natalChart.planets,
    significantAspects,
    dashaLord: 'Jupiter', // Would calculate from actual dasha
    bhuktiLord: 'Saturn'
  }
}

export async function calculateProgression(
  birthDate: Date,
  targetDate: Date,
  birthLat: number,
  birthLng: number,
  system: 'vedic' | 'western' | 'kp' = 'vedic'
): Promise<ProgressedChart> {
  const ageInYears = (targetDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  
  // Secondary progression: 1 day = 1 year
  const progressedDate = new Date(birthDate)
  progressedDate.setDate(progressedDate.getDate() + Math.floor(ageInYears))
  
  const progressedChart = await calculateChart(
    progressedDate,
    birthLat,
    birthLng,
    system,
    'lahiri'
  )

  const significantProgressions: Progression[] = []
  
  return {
    progressedDate,
    ageInYears,
    planets: progressedChart.planets,
    houses: progressedChart.houses,
    significantProgressions
  }
}

function getAspectInfluence(
  aspect: string,
  transitPlanet: string,
  natalPlanet: string
): 'positive' | 'negative' | 'neutral' {
  // Simplified influence calculation
  const beneficAspects = ['trine', 'sextile']
  const maleficAspects = ['square', 'opposition']
  
  if (beneficAspects.includes(aspect)) return 'positive'
  if (maleficAspects.includes(aspect)) return 'negative'
  return 'neutral'
}

export function getTransitInterpretation(transit: TransitAspect): string {
  const interpretations: Record<string, string> = {
    'Sun-conjunction': 'A time of new beginnings and increased vitality',
    'Moon-conjunction': 'Emotional intensity and intuitive insights',
    'Mercury-conjunction': 'Enhanced communication and mental clarity',
    'Venus-conjunction': 'Favorable for relationships and artistic pursuits',
    'Mars-conjunction': 'Increased energy and potential for conflict',
    'Jupiter-conjunction': 'Expansion, growth, and good fortune',
    'Saturn-conjunction': 'Discipline, responsibility, and potential restrictions'
  }
  
  const key = `${transit.natalPlanet}-${transit.aspect}`
  return interpretations[key] || `${transit.transitPlanet} ${transit.aspect} natal ${transit.natalPlanet}`
}