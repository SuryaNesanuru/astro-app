import { create } from 'zustand'
import { ChartData, calculateChart } from '../calculations/ephemeris'
import { DashaPeriod, calculateVimshottariDasha } from '../calculations/dasha'
import { Aspect, calculateAspects, calculateVedicAspects } from '../calculations/aspects'
import { KPSignificator, KPSubLord, calculateKPSignificators, calculateKPSubLords } from '../calculations/kp'

export interface ChartStore {
  // Chart data
  chartData: ChartData | null
  dashaData: DashaPeriod[] | null
  aspects: Aspect[] | null
  vedicAspects: Aspect[] | null
  kpSignificators: KPSignificator[] | null
  kpSubLords: KPSubLord[] | null
  
  // Chart settings
  system: 'vedic' | 'western' | 'kp'
  ayanamsha: string
  houseSystem: string
  chartStyle: 'north' | 'south' | 'wheel'
  
  // UI state
  loading: boolean
  selectedPlanet: string | null
  selectedHouse: number | null
  currentDate: Date
  
  // Actions
  setSystem: (system: 'vedic' | 'western' | 'kp') => void
  setAyanamsha: (ayanamsha: string) => void
  setHouseSystem: (system: string) => void
  setChartStyle: (style: 'north' | 'south' | 'wheel') => void
  setSelectedPlanet: (planet: string | null) => void
  setSelectedHouse: (house: number | null) => void
  setCurrentDate: (date: Date) => void
  calculateChartData: (date: Date, lat: number, lng: number) => Promise<void>
  clearChart: () => void
}

export const useChartStore = create<ChartStore>((set, get) => ({
  // Initial state
  chartData: null,
  dashaData: null,
  aspects: null,
  vedicAspects: null,
  kpSignificators: null,
  kpSubLords: null,
  system: 'vedic',
  ayanamsha: 'lahiri',
  houseSystem: 'placidus',
  chartStyle: 'north',
  loading: false,
  selectedPlanet: null,
  selectedHouse: null,
  currentDate: new Date(),
  
  // Actions
  setSystem: (system) => set({ system }),
  setAyanamsha: (ayanamsha) => set({ ayanamsha }),
  setHouseSystem: (houseSystem) => set({ houseSystem }),
  setChartStyle: (chartStyle) => set({ chartStyle }),
  setSelectedPlanet: (selectedPlanet) => set({ selectedPlanet }),
  setSelectedHouse: (selectedHouse) => set({ selectedHouse }),
  setCurrentDate: (currentDate) => set({ currentDate }),
  
  calculateChartData: async (date: Date, lat: number, lng: number) => {
    const { system, ayanamsha } = get()
    
    set({ loading: true })
    
    try {
      // Calculate basic chart data
      const chartData = await calculateChart(date, lat, lng, system, ayanamsha)
      
      // Calculate Vimshottari Dasha (using Moon's longitude)
      const moonPlanet = chartData.planets.find(p => p.name === 'Moon')
      const dashaData = moonPlanet 
        ? calculateVimshottariDasha(date, moonPlanet.longitude)
        : null
      
      // Calculate aspects
      const aspects = system === 'western' ? calculateAspects(chartData.planets) : null
      const vedicAspects = (system === 'vedic' || system === 'kp') 
        ? calculateVedicAspects(chartData.planets) 
        : null
      
      // Calculate KP data
      const kpSignificators = system === 'kp' 
        ? calculateKPSignificators(chartData.planets, chartData.houses)
        : null
      const kpSubLords = system === 'kp' 
        ? calculateKPSubLords(chartData.planets)
        : null
      
      set({
        chartData,
        dashaData,
        aspects,
        vedicAspects,
        kpSignificators,
        kpSubLords,
        loading: false
      })
    } catch (error) {
      console.error('Chart calculation error:', error)
      set({ loading: false })
    }
  },
  
  clearChart: () => set({
    chartData: null,
    dashaData: null,
    aspects: null,
    vedicAspects: null,
    kpSignificators: null,
    kpSubLords: null,
    selectedPlanet: null,
    selectedHouse: null
  })
}))