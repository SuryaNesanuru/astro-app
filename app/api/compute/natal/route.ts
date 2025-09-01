import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema
const ChartRequestSchema = z.object({
  birthDateTime: z.string().datetime(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string(),
  system: z.enum(['vedic', 'western', 'kp']),
  ayanamsha: z.string().optional(),
  houseSystem: z.string().optional(),
  placeName: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ChartRequestSchema.parse(body)
    
    const {
      birthDateTime,
      latitude,
      longitude,
      timezone,
      system,
      ayanamsha = 'lahiri',
      houseSystem = 'placidus',
      placeName
    } = validatedData

    // Convert birth date to UTC
    const birthDate = new Date(birthDateTime)
    const utcDate = new Date(birthDate.getTime() - (birthDate.getTimezoneOffset() * 60000))

    // Calculate chart data
    const chartData = await calculateNatalChart({
      birthDateTime: utcDate,
      latitude,
      longitude,
      timezone,
      system,
      ayanamsha,
      houseSystem,
      placeName
    })

    return NextResponse.json({
      success: true,
      data: chartData,
      metadata: {
        system,
        ayanamsha,
        houseSystem,
        calculatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Chart calculation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input data',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

interface ChartCalculationParams {
  birthDateTime: Date
  latitude: number
  longitude: number
  timezone: string
  system: 'vedic' | 'western' | 'kp'
  ayanamsha: string
  houseSystem: string
  placeName?: string
}

async function calculateNatalChart(params: ChartCalculationParams) {
  const {
    birthDateTime,
    latitude,
    longitude,
    system,
    ayanamsha,
    houseSystem
  } = params

  // Simulate ephemeris calculation
  // In production, this would use Swiss Ephemeris or similar library
  const planets = await calculatePlanetaryPositions(birthDateTime, latitude, longitude, system, ayanamsha)
  const houses = await calculateHouseCusps(birthDateTime, latitude, longitude, houseSystem)
  const ascendant = await calculateAscendant(birthDateTime, latitude, longitude)
  const aspects = await calculateAspects(planets, system)

  return {
    birthDateTime: birthDateTime.toISOString(),
    latitude,
    longitude,
    timezone: params.timezone,
    placeName: params.placeName,
    system,
    ayanamsha,
    houseSystem,
    ascendant,
    mc: houses.find(h => h.number === 10),
    planets,
    houses,
    aspects
  }
}

async function calculatePlanetaryPositions(
  date: Date,
  lat: number,
  lng: number,
  system: string,
  ayanamsha: string
) {
  // Simulate planetary positions
  // In production, this would use actual ephemeris calculations
  const planetNames = system === 'vedic' || system === 'kp' 
    ? ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu']
    : ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

  return planetNames.map((name, index) => {
    const baseLongitude = (index * 30 + (date.getTime() / 86400000) * 0.985556) % 360
    const adjustedLongitude = system === 'vedic' || system === 'kp' 
      ? (baseLongitude - getAyanamshaOffset(ayanamsha)) % 360
      : baseLongitude
    
    const sign = Math.floor(adjustedLongitude / 30)
    const house = Math.floor(adjustedLongitude / 30) + 1
    
    return {
      name,
      longitude: adjustedLongitude,
      sign: getSignName(sign),
      house,
      isRetrograde: Math.random() > 0.9,
      isExalted: Math.random() > 0.95,
      isDebilitated: Math.random() > 0.95,
      dailyMotion: 0.985556 + (Math.random() - 0.5) * 0.5,
      speed: 0.985556 + (Math.random() - 0.5) * 0.5
    }
  })
}

async function calculateHouseCusps(
  date: Date,
  lat: number,
  lng: number,
  houseSystem: string
) {
  // Simulate house cusp calculations
  // In production, this would use actual house system calculations
  const houses = []
  
  for (let i = 1; i <= 12; i++) {
    const baseLongitude = (i - 1) * 30 + (date.getTime() / 86400000) * 0.985556
    const longitude = baseLongitude % 360
    const sign = Math.floor(longitude / 30)
    
    houses.push({
      number: i,
      longitude,
      sign: getSignName(sign),
      lord: getSignLord(sign)
    })
  }
  
  return houses
}

async function calculateAscendant(
  date: Date,
  lat: number,
  lng: number
) {
  // Simulate ascendant calculation
  // In production, this would use actual astronomical calculations
  const baseLongitude = (date.getTime() / 86400000) * 0.985556
  const longitude = (baseLongitude + lng) % 360
  const sign = Math.floor(longitude / 30)
  
  return {
    longitude,
    sign: getSignName(sign),
    lord: getSignLord(sign)
  }
}

async function calculateAspects(planets: any[], system: string) {
  const aspects = []
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]
      const difference = Math.abs(planet1.longitude - planet2.longitude)
      
      // Check for major aspects
      if (system === 'western') {
        if (Math.abs(difference - 0) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Conjunction',
            orb: Math.abs(difference - 0),
            isApplying: difference < 0,
            influence: 'neutral'
          })
        } else if (Math.abs(difference - 60) <= 6) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Sextile',
            orb: Math.abs(difference - 60),
            isApplying: difference < 60,
            influence: 'positive'
          })
        } else if (Math.abs(difference - 90) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Square',
            orb: Math.abs(difference - 90),
            isApplying: difference < 90,
            influence: 'challenging'
          })
        } else if (Math.abs(difference - 120) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Trine',
            orb: Math.abs(difference - 120),
            isApplying: difference < 120,
            influence: 'positive'
          })
        } else if (Math.abs(difference - 180) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Opposition',
            orb: Math.abs(difference - 180),
            isApplying: difference < 180,
            influence: 'challenging'
          })
        }
      } else {
        // Vedic aspects (simplified)
        if (Math.abs(difference - 0) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Conjunction',
            orb: Math.abs(difference - 0),
            isApplying: difference < 0,
            influence: 'neutral'
          })
        } else if (Math.abs(difference - 120) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Trine',
            orb: Math.abs(difference - 120),
            isApplying: difference < 120,
            influence: 'positive'
          })
        } else if (Math.abs(difference - 180) <= 8) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: 'Opposition',
            orb: Math.abs(difference - 180),
            isApplying: difference < 180,
            influence: 'challenging'
          })
        }
      }
    }
  }
  
  return aspects
}

function getAyanamshaOffset(ayanamsha: string): number {
  // Simulate ayanamsha offsets
  const offsets: Record<string, number> = {
    'lahiri': 23.85,
    'raman': 22.5,
    'krishnamurti': 23.9,
    'yukteshwar': 22.4,
    'pushya': 23.9
  }
  return offsets[ayanamsha] || 23.85
}

function getSignName(signIndex: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  return signs[signIndex] || 'Unknown'
}

function getSignLord(signIndex: number): string {
  const lords = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
  ]
  return lords[signIndex] || 'Unknown'
}
