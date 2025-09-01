import { cn, formatDegree, longitudeToSign, longitudeToDegrees } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
      expect(cn('class1', false, 'class2')).toBe('class1 class2')
      expect(cn('class1', '', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
      expect(cn('base', 'class1', true && 'class2', false && 'class3')).toBe('base class1 class2')
    })

    it('handles empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
      expect(cn(undefined, null, false, '')).toBe('')
    })

    it('handles complex conditional logic', () => {
      const isActive = true
      const isDisabled = false
      const variant = 'primary'
      
      const result = cn(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled',
        variant === 'primary' && 'bg-blue-500',
        variant === 'secondary' && 'bg-gray-500'
      )
      
      expect(result).toBe('base-class active bg-blue-500')
    })
  })

  describe('longitudeToSign function', () => {
    it('converts longitude to correct sign index', () => {
      // Aries: 0-30°
      expect(longitudeToSign(0)).toBe(0)
      expect(longitudeToSign(15)).toBe(0)
      expect(longitudeToSign(29.99)).toBe(0)
      
      // Taurus: 30-60°
      expect(longitudeToSign(30)).toBe(1)
      expect(longitudeToSign(45)).toBe(1)
      expect(longitudeToSign(59.99)).toBe(1)
      
      // Gemini: 60-90°
      expect(longitudeToSign(60)).toBe(2)
      expect(longitudeToSign(75)).toBe(2)
      expect(longitudeToSign(89.99)).toBe(2)
    })

    it('handles edge cases', () => {
      expect(longitudeToSign(360)).toBe(0) // Full circle
      expect(longitudeToSign(390)).toBe(0) // Beyond full circle
      expect(longitudeToSign(-30)).toBe(11) // Negative longitude (Pisces)
      expect(longitudeToSign(-90)).toBe(9) // Negative longitude (Sagittarius)
    })

    it('handles decimal longitudes', () => {
      expect(longitudeToSign(30.5)).toBe(1)
      expect(longitudeToSign(45.123)).toBe(1)
      expect(longitudeToSign(89.999)).toBe(2)
    })
  })

  describe('longitudeToDegrees function', () => {
    it('converts longitude to degrees, minutes, and seconds', () => {
      // Test exact degrees
      expect(longitudeToDegrees(0)).toEqual({ degree: 0, minute: 0, second: 0 })
      expect(longitudeToDegrees(30)).toEqual({ degree: 30, minute: 0, second: 0 })
      expect(longitudeToDegrees(45)).toEqual({ degree: 45, minute: 0, second: 0 })
      
      // Test with minutes
      expect(longitudeToDegrees(30.5)).toEqual({ degree: 30, minute: 30, second: 0 })
      expect(longitudeToDegrees(45.25)).toEqual({ degree: 45, minute: 15, second: 0 })
      
      // Test with seconds
      expect(longitudeToDegrees(30.5 + 1/3600)).toEqual({ degree: 30, minute: 30, second: 1 })
      expect(longitudeToDegrees(45.25 + 30/3600)).toEqual({ degree: 45, minute: 15, second: 30 })
    })

    it('handles edge cases', () => {
      // Test 0 longitude
      expect(longitudeToDegrees(0)).toEqual({ degree: 0, minute: 0, second: 0 })
      
      // Test 29.999° (almost 30°)
      expect(longitudeToDegrees(29.999)).toEqual({ degree: 29, minute: 59, second: 56 })
      
      // Test negative longitude
      expect(longitudeToDegrees(-30.5)).toEqual({ degree: 29, minute: 30, second: 0 })
    })

    it('handles decimal precision correctly', () => {
      // Test various decimal precisions
      expect(longitudeToDegrees(15.123456)).toEqual({ degree: 15, minute: 7, second: 24 })
      expect(longitudeToDegrees(22.987654)).toEqual({ degree: 22, minute: 59, second: 15 })
      expect(longitudeToDegrees(7.5)).toEqual({ degree: 7, minute: 30, second: 0 })
    })

    it('normalizes longitude values', () => {
      // Test values beyond 30°
      expect(longitudeToDegrees(45.5)).toEqual({ degree: 15, minute: 30, second: 0 })
      expect(longitudeToDegrees(60.25)).toEqual({ degree: 0, minute: 15, second: 0 })
      expect(longitudeToDegrees(90.75)).toEqual({ degree: 0, minute: 45, second: 0 })
    })
  })

  describe('formatDegree function', () => {
    it('formats longitude to degree string', () => {
      expect(formatDegree(0)).toBe('0°0\'0"')
      expect(formatDegree(30)).toBe('30°0\'0"')
      expect(formatDegree(45.5)).toBe('45°30\'0"')
      expect(formatDegree(22.987654)).toBe('22°59\'15"')
    })

    it('handles edge cases', () => {
      expect(formatDegree(29.999)).toBe('29°59\'56"')
      expect(formatDegree(0.001)).toBe('0°0\'3"')
      expect(formatDegree(30.5)).toBe('0°30\'0"') // Normalized to 0-30 range
    })

    it('produces consistent output format', () => {
      const testCases = [0, 15, 30.5, 45.25, 22.987654]
      
      testCases.forEach(longitude => {
        const result = formatDegree(longitude)
        expect(result).toMatch(/^\d+°\d+\'\d+"$/)
        expect(result).toContain('°')
        expect(result).toContain('\'')
        expect(result).toContain('"')
      })
    })
  })

  describe('Integration tests', () => {
    it('longitudeToSign and longitudeToDegrees work together', () => {
      const testLongitudes = [0, 15, 30.5, 45.25, 60, 75.75, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]
      
      testLongitudes.forEach(longitude => {
        const sign = longitudeToSign(longitude)
        const degrees = longitudeToDegrees(longitude)
        
        // Sign should be 0-11
        expect(sign).toBeGreaterThanOrEqual(0)
        expect(sign).toBeLessThanOrEqual(11)
        
        // Degrees should be 0-29
        expect(degrees.degree).toBeGreaterThanOrEqual(0)
        expect(degrees.degree).toBeLessThanOrEqual(29)
        
        // Minutes should be 0-59
        expect(degrees.minute).toBeGreaterThanOrEqual(0)
        expect(degrees.minute).toBeLessThanOrEqual(59)
        
        // Seconds should be 0-59
        expect(degrees.second).toBeGreaterThanOrEqual(0)
        expect(degrees.second).toBeLessThanOrEqual(59)
      })
    })

    it('formatDegree produces valid degree strings', () => {
      const testLongitudes = [0, 15, 30.5, 45.25, 22.987654]
      
      testLongitudes.forEach(longitude => {
        const formatted = formatDegree(longitude)
        
        // Should contain degree symbols
        expect(formatted).toContain('°')
        expect(formatted).toContain('\'')
        expect(formatted).toContain('"')
        
        // Should be parseable back to numbers
        const parts = formatted.match(/(\d+)°(\d+)'(\d+)"/)
        expect(parts).toBeTruthy()
        
        if (parts) {
          const degree = parseInt(parts[1])
          const minute = parseInt(parts[2])
          const second = parseInt(parts[3])
          
          expect(degree).toBeGreaterThanOrEqual(0)
          expect(degree).toBeLessThanOrEqual(29)
          expect(minute).toBeGreaterThanOrEqual(0)
          expect(minute).toBeLessThanOrEqual(59)
          expect(second).toBeGreaterThanOrEqual(0)
          expect(second).toBeLessThanOrEqual(59)
        }
      })
    })
  })

  describe('Error handling', () => {
    it('handles invalid inputs gracefully', () => {
      // These should not throw errors
      expect(() => cn(undefined, null, false)).not.toThrow()
      expect(() => longitudeToSign(NaN)).not.toThrow()
      expect(() => longitudeToDegrees(Infinity)).not.toThrow()
      expect(() => formatDegree(-Infinity)).not.toThrow()
    })

    it('handles extreme values', () => {
      // Very large numbers
      expect(longitudeToSign(1000000)).toBeDefined()
      expect(longitudeToDegrees(1000000)).toBeDefined()
      expect(formatDegree(1000000)).toBeDefined()
      
      // Very small numbers
      expect(longitudeToSign(0.000001)).toBeDefined()
      expect(longitudeToDegrees(0.000001)).toBeDefined()
      expect(formatDegree(0.000001)).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('handles large numbers of class combinations efficiently', () => {
      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        cn(
          'base-class',
          i % 2 === 0 && 'even-class',
          i % 3 === 0 && 'divisible-by-3',
          i % 5 === 0 && 'divisible-by-5',
          'always-present'
        )
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100)
    })

    it('handles large numbers of longitude calculations efficiently', () => {
      const start = performance.now()
      
      for (let i = 0; i < 10000; i++) {
        longitudeToSign(i)
        longitudeToDegrees(i)
        formatDegree(i)
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete in reasonable time (less than 500ms)
      expect(duration).toBeLessThan(500)
    })
  })
})
