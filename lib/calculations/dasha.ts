export interface DashaPeriod {
  planet: string
  startDate: Date
  endDate: Date
  level: number
  children?: DashaPeriod[]
}

// Vimshottari Dasha periods in years
const DASHA_PERIODS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
}

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']

export function calculateVimshottariDasha(birthDate: Date, moonLongitude: number): DashaPeriod[] {
  // Calculate nakshatra from moon longitude
  const nakshatraIndex = Math.floor((moonLongitude % 360) / (360 / 27))
  
  // Determine starting dasha lord based on nakshatra
  const startingPlanetIndex = nakshatraIndex % 9
  const startingPlanet = DASHA_ORDER[startingPlanetIndex]
  
  const dashas: DashaPeriod[] = []
  let currentDate = new Date(birthDate)
  
  // Generate Maha Dashas (120 years total cycle)
  for (let i = 0; i < 9; i++) {
    const planetIndex = (startingPlanetIndex + i) % 9
    const planet = DASHA_ORDER[planetIndex]
    const period = DASHA_PERIODS[planet as keyof typeof DASHA_PERIODS]
    
    const endDate = new Date(currentDate)
    endDate.setFullYear(endDate.getFullYear() + period)
    
    const mahaDasha: DashaPeriod = {
      planet,
      startDate: new Date(currentDate),
      endDate,
      level: 1,
      children: []
    }
    
    // Generate Bhukti periods (sub-periods)
    let bhuktiStart = new Date(currentDate)
    for (let j = 0; j < 9; j++) {
      const bhuktiPlanetIndex = (planetIndex + j) % 9
      const bhuktiPlanet = DASHA_ORDER[bhuktiPlanetIndex]
      const bhuktiPeriod = DASHA_PERIODS[bhuktiPlanet as keyof typeof DASHA_PERIODS]
      const bhuktiDuration = (period * bhuktiPeriod) / 120 // Proportional duration
      
      const bhuktiEnd = new Date(bhuktiStart)
      bhuktiEnd.setFullYear(bhuktiEnd.getFullYear() + bhuktiDuration)
      
      const bhukti: DashaPeriod = {
        planet: bhuktiPlanet,
        startDate: new Date(bhuktiStart),
        endDate: bhuktiEnd,
        level: 2,
        children: []
      }
      
      // Generate Antar periods (sub-sub-periods)
      let antarStart = new Date(bhuktiStart)
      for (let k = 0; k < 9; k++) {
        const antarPlanetIndex = (bhuktiPlanetIndex + k) % 9
        const antarPlanet = DASHA_ORDER[antarPlanetIndex]
        const antarPeriod = DASHA_PERIODS[antarPlanet as keyof typeof DASHA_PERIODS]
        const antarDuration = (bhuktiDuration * antarPeriod) / 120
        
        const antarEnd = new Date(antarStart)
        antarEnd.setTime(antarEnd.getTime() + (antarDuration * 365.25 * 24 * 60 * 60 * 1000))
        
        const antar: DashaPeriod = {
          planet: antarPlanet,
          startDate: new Date(antarStart),
          endDate: antarEnd,
          level: 3,
          children: []
        }
        
        // Generate Sukshma periods (sub-sub-sub-periods)
        let sukshmaStart = new Date(antarStart)
        for (let l = 0; l < 9; l++) {
          const sukshmaPlanetIndex = (antarPlanetIndex + l) % 9
          const sukshmaPlanet = DASHA_ORDER[sukshmaPlanetIndex]
          const sukshmaPeriod = DASHA_PERIODS[sukshmaPlanet as keyof typeof DASHA_PERIODS]
          const sukshmaDuration = (antarDuration * sukshmaPeriod) / 120
          
          const sukshmaEnd = new Date(sukshmaStart)
          sukshmaEnd.setTime(sukshmaEnd.getTime() + (sukshmaDuration * 365.25 * 24 * 60 * 60 * 1000))
          
          antar.children!.push({
            planet: sukshmaPlanet,
            startDate: new Date(sukshmaStart),
            endDate: sukshmaEnd,
            level: 4
          })
          
          sukshmaStart = new Date(sukshmaEnd)
        }
        
        bhukti.children!.push(antar)
        antarStart = new Date(antarEnd)
      }
      
      mahaDasha.children!.push(bhukti)
      bhuktiStart = new Date(bhuktiEnd)
    }
    
    dashas.push(mahaDasha)
    currentDate = new Date(endDate)
  }
  
  return dashas
}

export function getCurrentDasha(dashas: DashaPeriod[], date: Date = new Date()): DashaPeriod | null {
  for (const dasha of dashas) {
    if (date >= dasha.startDate && date <= dasha.endDate) {
      return dasha
    }
  }
  return null
}

export function getCurrentDashaPath(dashas: DashaPeriod[], date: Date = new Date()): DashaPeriod[] {
  const path: DashaPeriod[] = []
  
  function findPath(periods: DashaPeriod[]): boolean {
    for (const period of periods) {
      if (date >= period.startDate && date <= period.endDate) {
        path.push(period)
        if (period.children && period.children.length > 0) {
          findPath(period.children)
        }
        return true
      }
    }
    return false
  }
  
  findPath(dashas)
  return path
}