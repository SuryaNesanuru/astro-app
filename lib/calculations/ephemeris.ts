export interface PlanetPosition {
  name: string
  longitude: number
  latitude: number
  distance: number
  speed: number
  house?: number
  sign?: number
  degree?: number
  minute?: number
  second?: number

  // Extra calculated flags
  isRetrograde?: boolean
  isExalted?: boolean
  isDebilitated?: boolean
  isCombust?: boolean
  isOwnSign?: boolean

  // Added to support transit calculations
  dailyMotion: number
}

export interface HouseCusp {
  house: number
  longitude: number
  sign: number
  degree: number
  minute: number
  second: number
}

export interface ChartData {
  planets: PlanetPosition[]
  houses: HouseCusp[]
  ascendant: number
  midheaven: number
  ayanamsha: number
}

export const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'
]

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

export const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1)

export const AYANAMSHAS = {
  lahiri: 24.1467,
  raman: 21.6167,
  krishnamurti: 23.6167,
  yukteshwar: 22.9167
}

export function longitudeToSign(longitude: number): number {
  return Math.floor(longitude / 30)
}

export function longitudeToDegrees(longitude: number): { degree: number; minute: number; second: number } {
  const normalizedLng = longitude % 30
  const degree = Math.floor(normalizedLng)
  const minute = Math.floor((normalizedLng - degree) * 60)
  const second = Math.floor(((normalizedLng - degree) * 60 - minute) * 60)
  return { degree, minute, second }
}

export function formatDegree(longitude: number): string {
  const { degree, minute, second } = longitudeToDegrees(longitude)
  return `${degree}°${minute}'${second}"`
}

export async function calculateChart(
  date: Date,
  latitude: number,
  longitude: number,
  system: 'vedic' | 'western' | 'kp' = 'vedic',
  ayanamsha: string = 'lahiri'
): Promise<ChartData> {
  const mockPlanets: PlanetPosition[] = [
    { name: 'Sun', longitude: 285.5, latitude: 0, distance: 1, speed: 1, dailyMotion: 1 },
    { name: 'Moon', longitude: 45.2, latitude: 2, distance: 0.002, speed: 13, dailyMotion: 13 },
    { name: 'Mercury', longitude: 275.8, latitude: 1, distance: 0.8, speed: 1.2, dailyMotion: 1.2 },
    { name: 'Venus', longitude: 320.1, latitude: -2, distance: 0.7, speed: 1.1, dailyMotion: 1.1 },
    { name: 'Mars', longitude: 180.3, latitude: 1.5, distance: 1.5, speed: 0.5, dailyMotion: 0.5 },
    { name: 'Jupiter', longitude: 15.7, latitude: 0.5, distance: 5.2, speed: 0.08, dailyMotion: 0.08 },
    { name: 'Saturn', longitude: 330.9, latitude: -1, distance: 9.5, speed: 0.03, dailyMotion: 0.03 },
    { name: 'Rahu', longitude: 90.4, latitude: 0, distance: 0, speed: -0.05, dailyMotion: -0.05 },
    { name: 'Ketu', longitude: 270.4, latitude: 0, distance: 0, speed: -0.05, dailyMotion: -0.05 },
  ]

  if (system === 'vedic' || system === 'kp') {
    const ayanValue = AYANAMSHAS[ayanamsha as keyof typeof AYANAMSHAS] || AYANAMSHAS.lahiri
    mockPlanets.forEach(planet => {
      planet.longitude = (planet.longitude - ayanValue + 360) % 360
    })
  }

  const ascendant = 75.5
  const houses: HouseCusp[] = []

  for (let i = 0; i < 12; i++) {
    const cuspLng = (ascendant + (i * 30)) % 360
    houses.push({
      house: i + 1,
      longitude: cuspLng,
      sign: longitudeToSign(cuspLng),
      ...longitudeToDegrees(cuspLng)
    })
  }

  mockPlanets.forEach(planet => {
    for (let i = 0; i < 12; i++) {
      const currentHouse = houses[i].longitude
      const nextHouse = houses[(i + 1) % 12].longitude

      if (nextHouse > currentHouse) {
        if (planet.longitude >= currentHouse && planet.longitude < nextHouse) {
          planet.house = i + 1
          break
        }
      } else {
        if (planet.longitude >= currentHouse || planet.longitude < nextHouse) {
          planet.house = i + 1
          break
        }
      }
    }

    planet.sign = longitudeToSign(planet.longitude)
    const degrees = longitudeToDegrees(planet.longitude)
    planet.degree = degrees.degree
    planet.minute = degrees.minute
    planet.second = degrees.second
  })

  return {
    planets: mockPlanets,
    houses,
    ascendant,
    midheaven: (ascendant + 90) % 360,
    ayanamsha: AYANAMSHAS[ayanamsha as keyof typeof AYANAMSHAS] || AYANAMSHAS.lahiri
  }
}
