import { PlanetPosition } from './ephemeris'

export interface Aspect {
  planet1: string
  planet2: string
  aspect: string
  orb: number
  exact: number
  applying: boolean
}

const WESTERN_ASPECTS = {
  conjunction: { angle: 0, orb: 8 },
  sextile: { angle: 60, orb: 6 },
  square: { angle: 90, orb: 8 },
  trine: { angle: 120, orb: 8 },
  opposition: { angle: 180, orb: 8 }
}

export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = []
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]
      
      let angle = Math.abs(planet1.longitude - planet2.longitude)
      if (angle > 180) {
        angle = 360 - angle
      }
      
      for (const [aspectName, aspectData] of Object.entries(WESTERN_ASPECTS)) {
        const diff = Math.abs(angle - aspectData.angle)
        
        if (diff <= aspectData.orb) {
          const applying = (planet1.speed > planet2.speed && angle < aspectData.angle) ||
                          (planet1.speed < planet2.speed && angle > aspectData.angle)
          
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspectName,
            orb: aspectData.orb,
            exact: diff,
            applying
          })
        }
      }
    }
  }
  
  return aspects
}

// Vedic aspects (special aspects)
export const VEDIC_ASPECTS = {
  Sun: [7],
  Moon: [7],
  Mars: [4, 7, 8],
  Mercury: [7],
  Jupiter: [5, 7, 9],
  Venus: [7],
  Saturn: [3, 7, 10],
  Rahu: [5, 7, 9],
  Ketu: [5, 7, 9]
}

export function calculateVedicAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = []
  
  for (const planet of planets) {
    const aspectHouses = VEDIC_ASPECTS[planet.name as keyof typeof VEDIC_ASPECTS] || [7]
    
    for (const aspectHouse of aspectHouses) {
      const targetHouse = ((planet.house! - 1 + aspectHouse - 1) % 12) + 1
      
      // Find planets in the target house
      const targetPlanets = planets.filter(p => p.house === targetHouse && p.name !== planet.name)
      
      for (const targetPlanet of targetPlanets) {
        aspects.push({
          planet1: planet.name,
          planet2: targetPlanet.name,
          aspect: `${aspectHouse}th house aspect`,
          orb: 0,
          exact: 0,
          applying: false
        })
      }
    }
  }
  
  return aspects
}