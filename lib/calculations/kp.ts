import { PlanetPosition, HouseCusp } from './ephemeris'

export interface KPSignificator {
  house: number
  planets: string[]
  description: string
}

export interface KPSubLord {
  planet: string
  subLord: string
  starLord: string
}

// KP Sub-divisions (each star divided into 9 sub-periods)
const KP_SUB_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
]

// Nakshatra lords
const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', // Aswini, Bharani, Krittika, Rohini
  'Mars', 'Rahu', 'Jupiter', 'Saturn', // Mrigasira, Ardra, Punarvasu, Pushya
  'Mercury', 'Ketu', 'Venus', 'Sun', // Ashlesha, Magha, Purva Phalguni, Uttara Phalguni
  'Moon', 'Mars', 'Rahu', 'Jupiter', // Hasta, Chitra, Swati, Vishakha
  'Saturn', 'Mercury', 'Ketu', 'Venus', // Anuradha, Jyestha, Mula, Purva Ashadha
  'Sun', 'Moon', 'Mars', 'Rahu', // Uttara Ashadha, Shravana, Dhanishta, Shatabhisha
  'Jupiter', 'Saturn', 'Mercury' // Purva Bhadrapada, Uttara Bhadrapada, Revati
]

export function calculateKPSubLords(planets: PlanetPosition[]): KPSubLord[] {
  const subLords: KPSubLord[] = []
  
  for (const planet of planets) {
    const nakshatra = Math.floor((planet.longitude % 360) / (360 / 27))
    const starLord = NAKSHATRA_LORDS[nakshatra]
    
    // Calculate sub-division within nakshatra
    const nakshatraProgress = ((planet.longitude % 360) / (360 / 27)) % 1
    const subIndex = Math.floor(nakshatraProgress * 9)
    const subLord = KP_SUB_LORDS[subIndex]
    
    subLords.push({
      planet: planet.name,
      subLord,
      starLord
    })
  }
  
  return subLords
}

export function calculateKPSignificators(
  planets: PlanetPosition[],
  houses: HouseCusp[]
): KPSignificator[] {
  const significators: KPSignificator[] = []
  
  // House significators based on planet placements and aspects
  for (let house = 1; house <= 12; house++) {
    const planetsInHouse = planets
      .filter(p => p.house === house)
      .map(p => p.name)
    
    const cuspLongitude = houses[house - 1].longitude
    const cuspNakshatra = Math.floor((cuspLongitude % 360) / (360 / 27))
    const cuspLord = NAKSHATRA_LORDS[cuspNakshatra]
    
    // Add cusp lord as significator
    const allSignificators = [...planetsInHouse]
    if (!allSignificators.includes(cuspLord)) {
      allSignificators.push(cuspLord)
    }
    
    significators.push({
      house,
      planets: allSignificators,
      description: getHouseDescription(house)
    })
  }
  
  return significators
}

function getHouseDescription(house: number): string {
  const descriptions = {
    1: 'Self, personality, appearance, health',
    2: 'Wealth, family, speech, food',
    3: 'Siblings, courage, communication, short journeys',
    4: 'Mother, home, property, happiness',
    5: 'Children, education, creativity, romance',
    6: 'Health, enemies, debts, service',
    7: 'Marriage, partnership, spouse',
    8: 'Longevity, transformation, occult, inheritance',
    9: 'Father, luck, religion, higher education',
    10: 'Career, reputation, authority',
    11: 'Income, gains, friends, elder siblings',
    12: 'Expenses, losses, foreign travel, spirituality'
  }
  return descriptions[house as keyof typeof descriptions] || ''
}

export const KP_HOUSE_MEANINGS = [
  { house: 1, meaning: 'Self, Personality, Health', keywords: ['identity', 'appearance', 'vitality'] },
  { house: 2, meaning: 'Wealth, Family, Speech', keywords: ['money', 'values', 'communication'] },
  { house: 3, meaning: 'Siblings, Courage, Skills', keywords: ['brothers', 'sisters', 'bravery', 'talents'] },
  { house: 4, meaning: 'Mother, Home, Comfort', keywords: ['property', 'emotions', 'security'] },
  { house: 5, meaning: 'Children, Creativity, Education', keywords: ['romance', 'speculation', 'learning'] },
  { house: 6, meaning: 'Health, Service, Enemies', keywords: ['work', 'illness', 'competition'] },
  { house: 7, meaning: 'Marriage, Partnership, Business', keywords: ['spouse', 'contracts', 'cooperation'] },
  { house: 8, meaning: 'Transformation, Occult, Inheritance', keywords: ['death', 'rebirth', 'secrets'] },
  { house: 9, meaning: 'Father, Luck, Spirituality', keywords: ['dharma', 'philosophy', 'fortune'] },
  { house: 10, meaning: 'Career, Status, Authority', keywords: ['profession', 'reputation', 'government'] },
  { house: 11, meaning: 'Gains, Friends, Hopes', keywords: ['income', 'social circle', 'wishes'] },
  { house: 12, meaning: 'Losses, Spirituality, Foreign', keywords: ['expenses', 'moksha', 'isolation'] }
]