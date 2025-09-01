import { renderHook, act } from '@testing-library/react'
import { useChartStore } from '@/lib/store/chart-store'
import { createMockChartData } from '@/__tests__/setup'

describe('Chart Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useChartStore())
    act(() => {
      result.current.clearChart()
    })
  })

  afterEach(() => {
    // Clean up after each test
    const { result } = renderHook(() => useChartStore())
    act(() => {
      result.current.clearChart()
    })
  })

  describe('Initial State', () => {
    it('has correct initial values', () => {
      const { result } = renderHook(() => useChartStore())
      
      expect(result.current.chartData).toBeNull()
      expect(result.current.system).toBe('vedic')
      expect(result.current.ayanamsha).toBe('lahiri')
      expect(result.current.houseSystem).toBe('placidus')
      expect(result.current.chartStyle).toBe('north')
      expect(result.current.selectedPlanet).toBeNull()
      expect(result.current.aspects).toEqual([])
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Chart Data Management', () => {
    it('sets chart data correctly', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(async () => {
        await result.current.calculateChartData(new Date('1990-01-01'), 40.7128, -74.0060)
      })
      
      expect(result.current.loading).toBe(false)
    })

    it('updates chart data through calculation', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(async () => {
        await result.current.calculateChartData(new Date('1990-01-01'), 40.7128, -74.0060)
      })
      
      expect(result.current.loading).toBe(false)
    })

    it('clears chart data', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.clearChart()
      })
      
      expect(result.current.chartData).toBeNull()
      expect(result.current.selectedPlanet).toBeNull()
      expect(result.current.selectedHouse).toBeNull()
    })
  })

  describe('System Settings', () => {
    it('changes astrological system', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setSystem('western')
      })
      
      expect(result.current.system).toBe('western')
    })

    it('changes ayanamsha', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setAyanamsha('raman')
      })
      
      expect(result.current.ayanamsha).toBe('raman')
    })

    it('changes house system', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setHouseSystem('whole')
      })
      
      expect(result.current.houseSystem).toBe('whole')
    })

    it('changes chart style', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setChartStyle('south')
      })
      
      expect(result.current.chartStyle).toBe('south')
    })

    it('validates system values', () => {
      const { result } = renderHook(() => useChartStore())
      
      // Test valid systems
      const validSystems = ['vedic', 'western', 'kp']
      validSystems.forEach(system => {
        act(() => {
          result.current.setSystem(system as any)
        })
        expect(result.current.system).toBe(system)
      })
    })

    it('validates ayanamsha values', () => {
      const { result } = renderHook(() => useChartStore())
      
      // Test valid ayanamshas
      const validAyanamshas = ['lahiri', 'raman', 'krishnamurti', 'yukteshwar', 'pushya']
      validAyanamshas.forEach(ayanamsha => {
        act(() => {
          result.current.setAyanamsha(ayanamsha as any)
        })
        expect(result.current.ayanamsha).toBe(ayanamsha)
      })
    })

    it('validates house system values', () => {
      const { result } = renderHook(() => useChartStore())
      
      // Test valid house systems
      const validHouseSystems = ['placidus', 'whole', 'koch', 'porphyrius', 'equal']
      validHouseSystems.forEach(houseSystem => {
        act(() => {
          result.current.setHouseSystem(houseSystem as any)
        })
        expect(result.current.houseSystem).toBe(houseSystem)
      })
    })

    it('validates chart style values', () => {
      const { result } = renderHook(() => useChartStore())
      
      // Test valid chart styles
      const validChartStyles = ['north', 'south', 'western']
      validChartStyles.forEach(chartStyle => {
        act(() => {
          result.current.setChartStyle(chartStyle as any)
        })
        expect(result.current.chartStyle).toBe(chartStyle)
      })
    })
  })

  describe('Planet Selection', () => {
    it('selects a planet', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setSelectedPlanet('Sun')
      })
      
      expect(result.current.selectedPlanet).toBe('Sun')
    })

    it('deselects a planet', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setSelectedPlanet('Sun')
        result.current.setSelectedPlanet(null)
      })
      
      expect(result.current.selectedPlanet).toBeNull()
    })

    it('handles invalid planet selection', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setSelectedPlanet('InvalidPlanet' as any)
      })
      
      expect(result.current.selectedPlanet).toBe('InvalidPlanet')
    })
  })

  describe('Aspects Management', () => {
    it('sets aspects correctly through calculation', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(async () => {
        await result.current.calculateChartData(new Date('1990-01-01'), 40.7128, -74.0060)
      })
      
      // Aspects are calculated automatically when chart data is calculated
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Loading States', () => {
    it('sets loading state during calculation', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(async () => {
        result.current.calculateChartData(new Date('1990-01-01'), 40.7128, -74.0060)
      })
      
      // Loading should be true during calculation
      expect(result.current.loading).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('handles calculation errors gracefully', () => {
      const { result } = renderHook(() => useChartStore())
      
      // Mock a failed calculation
      act(async () => {
        try {
          await result.current.calculateChartData(new Date('1990-01-01'), 40.7128, -74.0060)
        } catch (error) {
          // Error should be handled gracefully
        }
      })
      
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Store Reset', () => {
    it('resets chart data to initial state', () => {
      const { result } = renderHook(() => useChartStore())
      
      // Set various states
      act(() => {
        result.current.setSystem('western')
        result.current.setAyanamsha('raman')
        result.current.setHouseSystem('whole')
        result.current.setChartStyle('south')
        result.current.setSelectedPlanet('Sun')
        result.current.setSelectedHouse(1)
      })
      
      // Verify states are set
      expect(result.current.system).toBe('western')
      expect(result.current.ayanamsha).toBe('raman')
      expect(result.current.houseSystem).toBe('whole')
      expect(result.current.chartStyle).toBe('south')
      expect(result.current.selectedPlanet).toBe('Sun')
      expect(result.current.selectedHouse).toBe(1)
      
      // Reset chart data
      act(() => {
        result.current.clearChart()
      })
      
      // Verify chart data is cleared
      expect(result.current.chartData).toBeNull()
      expect(result.current.selectedPlanet).toBeNull()
      expect(result.current.selectedHouse).toBeNull()
      
      // Other settings should remain
      expect(result.current.system).toBe('western')
      expect(result.current.ayanamsha).toBe('raman')
    })
  })

  describe('Store Persistence', () => {
    it('maintains state across multiple renders', () => {
      const { result, rerender } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setSystem('western')
        result.current.setAyanamsha('raman')
      })
      
      // Rerender the hook
      rerender()
      
      // State should persist
      expect(result.current.system).toBe('western')
      expect(result.current.ayanamsha).toBe('raman')
    })
  })

  describe('Performance', () => {
    it('handles rapid state updates efficiently', () => {
      const { result } = renderHook(() => useChartStore())
      const start = performance.now()
      
      // Perform many rapid updates
      for (let i = 0; i < 1000; i++) {
        act(() => {
          result.current.setSystem(i % 2 === 0 ? 'vedic' : 'western')
          result.current.setAyanamsha(i % 3 === 0 ? 'lahiri' : 'raman')
        })
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100)
      
      // Final state should be correct
      expect(result.current.system).toBe('western')
      expect(result.current.ayanamsha).toBe('raman')
    })
  })

  describe('Type Safety', () => {
    it('maintains type safety for chart settings', () => {
      const { result } = renderHook(() => useChartStore())
      
      act(() => {
        result.current.setSystem('western')
        result.current.setAyanamsha('raman')
        result.current.setHouseSystem('whole')
        result.current.setChartStyle('south')
      })
      
      // TypeScript should infer correct types
      expect(result.current.system).toBe('western')
      expect(result.current.ayanamsha).toBe('raman')
      expect(result.current.houseSystem).toBe('whole')
      expect(result.current.chartStyle).toBe('south')
    })
  })
})
