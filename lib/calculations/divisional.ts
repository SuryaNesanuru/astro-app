import { PlanetPosition, SIGNS } from './ephemeris'

export interface DivisionalChart {
  division: string
  name: string
  planets: PlanetPosition[]
  significance: string
}

export const DIVISIONAL_CHARTS = {
  D1: { name: 'Rashi (Birth Chart)', significance: 'Overall life, personality, physical body' },
  D2: { name: 'Hora', significance: 'Wealth, financial matters' },
  D3: { name: 'Drekkana', significance: 'Siblings, courage, communication' },
  D4: { name: 'Chaturthamsa', significance: 'Fortune, property, mother' },
  D5: { name: 'Panchamamsa', significance: 'Fame, authority, learning' },
  D6: { name: 'Shashthamsa', significance: 'Health, enemies, obstacles' },
  D7: { name: 'Saptamamsa', significance: 'Children, creativity' },
  D8: { name: 'Ashtamamsa', significance: 'Longevity, sudden events' },
  D9: { name: 'Navamsa', significance: 'Marriage, dharma, spiritual growth' },
  D10: { name: 'Dasamsa', significance: 'Career, profession, status' },
  D12: { name: 'Dvadasamsa', significance: 'Parents, ancestry' },
  D16: { name: 'Shodasamsa', significance: 'Vehicles, luxuries' },
  D20: { name: 'Vimsamsa', significance: 'Spirituality, worship' },
  D24: { name: 'Chaturvimsamsa', significance: 'Learning, knowledge' },
  D27: { name: 'Nakshatramsa', significance: 'Strengths, weaknesses' },
  D30: { name: 'Trimsamsa', significance: 'Misfortunes, evils' },
  D40: { name: 'Khavedamsa', significance: 'Maternal relatives' },
  D45: { name: 'Akshavedamsa', significance: 'Character, conduct' },
  D60: { name: 'Shashtiamsa', significance: 'Past life, karma' }
}

export function calculateDivisionalChart(
  planets: PlanetPosition[],
  division: number
): DivisionalChart {
  const divisionalPlanets: PlanetPosition[] = []
  
  for (const planet of planets) {
    const longitude = planet.longitude
    const sign = Math.floor(longitude / 30)
    const degree = longitude % 30
    
    let divisionalSign: number
    
    switch (division) {
      case 2: // Hora
        divisionalSign = degree < 15 ? (sign % 2 === 0 ? 0 : 3) : (sign % 2 === 0 ? 3 : 0)
        break
        
      case 3: // Drekkana
        if (degree < 10) divisionalSign = sign
        else if (degree < 20) divisionalSign = (sign + 4) % 12
        else divisionalSign = (sign + 8) % 12
        break
        
      case 4: // Chaturthamsa
        if (degree < 7.5) divisionalSign = sign
        else if (degree < 15) divisionalSign = (sign + 3) % 12
        else if (degree < 22.5) divisionalSign = (sign + 6) % 12
        else divisionalSign = (sign + 9) % 12
        break
        
      case 7: // Saptamamsa
        const seventhPart = Math.floor(degree / (30 / 7))
        if (sign % 2 === 0) {
          divisionalSign = (sign + seventhPart) % 12
        } else {
          divisionalSign = (sign + 6 + seventhPart) % 12
        }
        break
        
      case 9: // Navamsa
        const navamsaPart = Math.floor(degree / (30 / 9))
        if (sign % 4 === 0) divisionalSign = (0 + navamsaPart) % 12
        else if (sign % 4 === 1) divisionalSign = (3 + navamsaPart) % 12
        else if (sign % 4 === 2) divisionalSign = (6 + navamsaPart) % 12
        else divisionalSign = (9 + navamsaPart) % 12
        break
        
      case 10: // Dasamsa
        const dasamsPart = Math.floor(degree / 3)
        if (sign % 2 === 0) {
          divisionalSign = (8 + dasamsPart) % 12
        } else {
          divisionalSign = (5 + dasamsPart) % 12
        }
        break
        
      case 60: // Shashtiamsa
        const shashtiPart = Math.floor(degree / 0.5)
        divisionalSign = shashtiPart % 12
        break
        
      default:
        divisionalSign = sign // Default to same sign
    }
    
    const divisionalLongitude = divisionalSign * 30 + (degree % (30 / division)) * division
    
    divisionalPlanets.push({
      ...planet,
      longitude: divisionalLongitude,
      sign: divisionalSign,
      degree: Math.floor(divisionalLongitude % 30),
      minute: Math.floor(((divisionalLongitude % 30) - Math.floor(divisionalLongitude % 30)) * 60),
      second: Math.floor((((divisionalLongitude % 30) - Math.floor(divisionalLongitude % 30)) * 60 - 
                Math.floor(((divisionalLongitude % 30) - Math.floor(divisionalLongitude % 30)) * 60)) * 60)
    })
  }
  
  const divisionKey = `D${division}` as keyof typeof DIVISIONAL_CHARTS
  const chartInfo = DIVISIONAL_CHARTS[divisionKey] || { 
    name: `D${division}`, 
    significance: 'Custom divisional chart' 
  }
  
  return {
    division: `D${division}`,
    name: chartInfo.name,
    planets: divisionalPlanets,
    significance: chartInfo.significance
  }
}

export function getDivisionalStrength(
  planet: string,
  divisionalCharts: DivisionalChart[]
): {
  totalScore: number
  breakdown: { division: string; position: string; score: number }[]
} {
  const breakdown: { division: string; position: string; score: number }[] = []
  let totalScore = 0
  
  for (const chart of divisionalCharts) {
    const planetData = chart.planets.find(p => p.name === planet)
    if (planetData) {
      const signName = SIGNS[planetData.sign!]
      let score = 0
      
      // Simplified scoring system
      if (isOwnSign(planet, planetData.sign!)) score += 5
      else if (isExaltedSign(planet, planetData.sign!)) score += 6
      else if (isFriendlySign(planet, planetData.sign!)) score += 3
      else if (isEnemySign(planet, planetData.sign!)) score -= 2
      else if (isDebilitatedSign(planet, planetData.sign!)) score -= 5
      else score += 1 // Neutral
      
      breakdown.push({
        division: chart.division,
        position: signName,
        score
      })
      
      totalScore += score
    }
  }
  
  return { totalScore, breakdown }
}

function isOwnSign(planet: string, sign: number): boolean {
  const ownSigns: Record<string, number[]> = {
    'Sun': [4], // Leo
    'Moon': [3], // Cancer
    'Mars': [0, 7], // Aries, Scorpio
    'Mercury': [2, 5], // Gemini, Virgo
    'Jupiter': [8, 11], // Sagittarius, Pisces
    'Venus': [1, 6], // Taurus, Libra
    'Saturn': [9, 10] // Capricorn, Aquarius
  }
  return ownSigns[planet]?.includes(sign) || false
}

function isExaltedSign(planet: string, sign: number): boolean {
  const exaltationSigns: Record<string, number> = {
    'Sun': 0, // Aries
    'Moon': 1, // Taurus
    'Mars': 9, // Capricorn
    'Mercury': 5, // Virgo
    'Jupiter': 3, // Cancer
    'Venus': 11, // Pisces
    'Saturn': 6 // Libra
  }
  return exaltationSigns[planet] === sign
}

function isDebilitatedSign(planet: string, sign: number): boolean {
  const debilitationSigns: Record<string, number> = {
    'Sun': 6, // Libra
    'Moon': 7, // Scorpio
    'Mars': 3, // Cancer
    'Mercury': 11, // Pisces
    'Jupiter': 9, // Capricorn
    'Venus': 5, // Virgo
    'Saturn': 0 // Aries
  }
  return debilitationSigns[planet] === sign
}

function isFriendlySign(planet: string, sign: number): boolean {
  // Simplified - in practice this would be more complex
  return false
}

function isEnemySign(planet: string, sign: number): boolean {
  // Simplified - in practice this would be more complex
  return false
}