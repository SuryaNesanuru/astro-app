import { NextRequest } from 'next/server'
import { POST } from '@/app/api/compute/natal/route'

// Mock the ephemeris calculation
jest.mock('@/lib/calculations/ephemeris', () => ({
  calculateChart: jest.fn(),
}))

describe('Natal Chart API Route', () => {
  const mockCalculateChart = require('@/lib/calculations/ephemeris').calculateChart

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/compute/natal', () => {
    it('returns 400 for invalid request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid request data')
    })

    it('returns 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          // Missing birthTime, latitude, longitude
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid request data')
    })

    it('returns 400 for invalid date format', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: 'invalid-date',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid birth date')
    })

    it('returns 400 for invalid time format', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: 'invalid-time',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid birth time')
    })

    it('returns 400 for invalid latitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 200, // Invalid latitude
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid latitude')
    })

    it('returns 400 for invalid longitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: 200, // Invalid longitude
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid longitude')
    })

    it('returns 400 for invalid system', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'invalid-system',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid system')
    })

    it('returns 400 for invalid ayanamsha', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'invalid-ayanamsha',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid ayanamsha')
    })

    it('returns 400 for invalid house system', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'invalid-house-system',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid house system')
    })

    it('successfully computes natal chart with valid data', async () => {
      const mockChartData = {
        planets: [
          { name: 'Sun', longitude: 285.5, latitude: 0, distance: 1, speed: 1 },
          { name: 'Moon', longitude: 45.2, latitude: 2, distance: 0.002, speed: 13 },
        ],
        houses: [
          { house: 1, longitude: 75.5, sign: 2, degree: 15, minute: 30, second: 0 },
          { house: 2, longitude: 105.5, sign: 3, degree: 15, minute: 30, second: 0 },
        ],
        ascendant: 75.5,
        midheaven: 165.5,
        ayanamsha: 24.1467,
      }

      mockCalculateChart.mockResolvedValue(mockChartData)

      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.chartData).toEqual(mockChartData)
      expect(data.metadata).toEqual({
        birthDate: '1990-01-01',
        birthTime: '12:00',
        latitude: 40.7128,
        longitude: -74.0060,
        system: 'vedic',
        ayanamsha: 'lahiri',
        houseSystem: 'placidus',
        computedAt: expect.any(String),
      })
    })

    it('handles calculation errors gracefully', async () => {
      mockCalculateChart.mockRejectedValue(new Error('Calculation failed'))

      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data.error).toBe('Failed to compute natal chart')
    })

    it('validates date range boundaries', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1800-01-01', // Very old date
          birthTime: '12:00',
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Birth date out of supported range')
    })

    it('validates coordinate precision', async () => {
      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '12:00',
          latitude: 40.7128123456789, // Too many decimal places
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid latitude')
    })

    it('handles different timezone inputs', async () => {
      const mockChartData = {
        planets: [],
        houses: [],
        ascendant: 75.5,
        midheaven: 165.5,
        ayanamsha: 24.1467,
      }

      mockCalculateChart.mockResolvedValue(mockChartData)

      const request = new NextRequest('http://localhost:3000/api/compute/natal', {
        method: 'POST',
        body: JSON.stringify({
          birthDate: '1990-01-01',
          birthTime: '23:30', // Late night time
          latitude: 40.7128,
          longitude: -74.0060,
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('supports all valid system types', async () => {
      const systems = ['vedic', 'western', 'kp']
      const mockChartData = {
        planets: [],
        houses: [],
        ascendant: 75.5,
        midheaven: 165.5,
        ayanamsha: 24.1467,
      }

      mockCalculateChart.mockResolvedValue(mockChartData)

      for (const system of systems) {
        const request = new NextRequest('http://localhost:3000/api/compute/natal', {
          method: 'POST',
          body: JSON.stringify({
            birthDate: '1990-01-01',
            birthTime: '12:00',
            latitude: 40.7128,
            longitude: -74.0060,
            system,
            ayanamsha: 'lahiri',
            houseSystem: 'placidus',
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)

        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.metadata.system).toBe(system)
      }
    })

    it('supports all valid ayanamsha types', async () => {
      const ayanamshas = ['lahiri', 'raman', 'krishnamurti', 'yukteshwar', 'pushya']
      const mockChartData = {
        planets: [],
        houses: [],
        ascendant: 75.5,
        midheaven: 165.5,
        ayanamsha: 24.1467,
      }

      mockCalculateChart.mockResolvedValue(mockChartData)

      for (const ayanamsha of ayanamshas) {
        const request = new NextRequest('http://localhost:3000/api/compute/natal', {
          method: 'POST',
          body: JSON.stringify({
            birthDate: '1990-01-01',
            birthTime: '12:00',
            latitude: 40.7128,
            longitude: -74.0060,
            system: 'vedic',
            ayanamsha,
            houseSystem: 'placidus',
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)

        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.metadata.ayanamsha).toBe(ayanamsha)
      }
    })

    it('supports all valid house system types', async () => {
      const houseSystems = ['placidus', 'whole', 'koch', 'porphyrius', 'equal']
      const mockChartData = {
        planets: [],
        houses: [],
        ascendant: 75.5,
        midheaven: 165.5,
        ayanamsha: 24.1467,
      }

      mockCalculateChart.mockResolvedValue(mockChartData)

      for (const houseSystem of houseSystems) {
        const request = new NextRequest('http://localhost:3000/api/compute/natal', {
          method: 'POST',
          body: JSON.stringify({
            birthDate: '1990-01-01',
            birthTime: '12:00',
            latitude: 40.7128,
            longitude: -74.0060,
            system: 'vedic',
            ayanamsha: 'lahiri',
            houseSystem,
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)

        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.metadata.houseSystem).toBe(houseSystem)
      }
    })
  })
})
