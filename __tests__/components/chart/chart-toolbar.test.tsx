import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChartToolbar } from '@/components/chart/chart-toolbar'

// Mock the chart store
jest.mock('@/lib/store/chart-store', () => ({
  useChartStore: () => ({
    system: 'vedic',
    ayanamsha: 'lahiri',
    houseSystem: 'placidus',
    chartStyle: 'north',
    setSystem: jest.fn(),
    setAyanamsha: jest.fn(),
    setHouseSystem: jest.fn(),
    setChartStyle: jest.fn(),
  }),
}))

describe('Chart Toolbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all toolbar controls', () => {
      render(<ChartToolbar />)
      
      expect(screen.getByText('System')).toBeInTheDocument()
      expect(screen.getByText('Ayanamsha')).toBeInTheDocument()
      expect(screen.getByText('House System')).toBeInTheDocument()
      expect(screen.getByText('Chart Style')).toBeInTheDocument()
    })

    it('displays current settings values', () => {
      render(<ChartToolbar />)
      
      expect(screen.getByDisplayValue('vedic')).toBeInTheDocument()
      expect(screen.getByDisplayValue('lahiri')).toBeInTheDocument()
      expect(screen.getByDisplayValue('placidus')).toBeInTheDocument()
      expect(screen.getByDisplayValue('north')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
      render(<ChartToolbar />)
      
      expect(screen.getByText('Save')).toBeInTheDocument()
      expect(screen.getByText('Print')).toBeInTheDocument()
    })
  })

  describe('System Selection', () => {
    it('shows all system options', () => {
      render(<ChartToolbar />)
      
      const systemSelect = screen.getByDisplayValue('vedic')
      fireEvent.click(systemSelect)
      
      // Check for system options
      expect(screen.getByText('Vedic')).toBeInTheDocument()
      expect(screen.getByText('Western')).toBeInTheDocument()
      expect(screen.getByText('KP')).toBeInTheDocument()
    })

    it('allows system selection', async () => {
      const mockSetSystem = jest.fn()
      jest.doMock('@/lib/store/chart-store', () => ({
        useChartStore: () => ({
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
          chartStyle: 'north',
          setSystem: mockSetSystem,
          setAyanamsha: jest.fn(),
          setHouseSystem: jest.fn(),
          setChartStyle: jest.fn(),
        }),
      }))

      render(<ChartToolbar />)
      
      const systemSelect = screen.getByDisplayValue('vedic')
      fireEvent.change(systemSelect, { target: { value: 'western' } })
      
      await waitFor(() => {
        expect(mockSetSystem).toHaveBeenCalledWith('western')
      })
    })
  })

  describe('Ayanamsha Selection', () => {
    it('shows all ayanamsha options', () => {
      render(<ChartToolbar />)
      
      const ayanamshaSelect = screen.getByDisplayValue('lahiri')
      fireEvent.click(ayanamshaSelect)
      
      // Check for ayanamsha options
      expect(screen.getByText('Lahiri')).toBeInTheDocument()
      expect(screen.getByText('Raman')).toBeInTheDocument()
      expect(screen.getByText('Krishnamurti')).toBeInTheDocument()
      expect(screen.getByText('Yukteshwar')).toBeInTheDocument()
      expect(screen.getByText('Pushya')).toBeInTheDocument()
    })

    it('allows ayanamsha selection', async () => {
      const mockSetAyanamsha = jest.fn()
      jest.doMock('@/lib/store/chart-store', () => ({
        useChartStore: () => ({
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
          chartStyle: 'north',
          setSystem: jest.fn(),
          setAyanamsha: mockSetAyanamsha,
          setHouseSystem: jest.fn(),
          setChartStyle: jest.fn(),
        }),
      }))

      render(<ChartToolbar />)
      
      const ayanamshaSelect = screen.getByDisplayValue('lahiri')
      fireEvent.change(ayanamshaSelect, { target: { value: 'raman' } })
      
      await waitFor(() => {
        expect(mockSetAyanamsha).toHaveBeenCalledWith('raman')
      })
    })
  })

  describe('House System Selection', () => {
    it('shows all house system options', () => {
      render(<ChartToolbar />)
      
      const houseSystemSelect = screen.getByDisplayValue('placidus')
      fireEvent.click(houseSystemSelect)
      
      // Check for house system options
      expect(screen.getByText('Placidus')).toBeInTheDocument()
      expect(screen.getByText('Whole House')).toBeInTheDocument()
      expect(screen.getByText('Koch')).toBeInTheDocument()
      expect(screen.getByText('Porphyrius')).toBeInTheDocument()
      expect(screen.getByText('Equal')).toBeInTheDocument()
    })

    it('allows house system selection', async () => {
      const mockSetHouseSystem = jest.fn()
      jest.doMock('@/lib/store/chart-store', () => ({
        useChartStore: () => ({
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
          chartStyle: 'north',
          setSystem: jest.fn(),
          setAyanamsha: jest.fn(),
          setHouseSystem: mockSetHouseSystem,
          setChartStyle: jest.fn(),
        }),
      }))

      render(<ChartToolbar />)
      
      const houseSystemSelect = screen.getByDisplayValue('placidus')
      fireEvent.change(houseSystemSelect, { target: { value: 'whole' } })
      
      await waitFor(() => {
        expect(mockSetHouseSystem).toHaveBeenCalledWith('whole')
      })
    })
  })

  describe('Chart Style Selection', () => {
    it('shows all chart style options', () => {
      render(<ChartToolbar />)
      
      const chartStyleSelect = screen.getByDisplayValue('north')
      fireEvent.click(chartStyleSelect)
      
      // Check for chart style options
      expect(screen.getByText('North Indian')).toBeInTheDocument()
      expect(screen.getByText('South Indian')).toBeInTheDocument()
      expect(screen.getByText('Western Wheel')).toBeInTheDocument()
    })

    it('allows chart style selection', async () => {
      const mockSetChartStyle = jest.fn()
      jest.doMock('@/lib/store/chart-store', () => ({
        useChartStore: () => ({
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
          chartStyle: 'north',
          setSystem: jest.fn(),
          setAyanamsha: jest.fn(),
          setHouseSystem: jest.fn(),
          setChartStyle: mockSetChartStyle,
        }),
      }))

      render(<ChartToolbar />)
      
      const chartStyleSelect = screen.getByDisplayValue('north')
      fireEvent.change(chartStyleSelect, { target: { value: 'south' } })
      
      await waitFor(() => {
        expect(mockSetChartStyle).toHaveBeenCalledWith('south')
      })
    })
  })

  describe('Date Picker', () => {
    it('renders date picker input', () => {
      render(<ChartToolbar />)
      
      const dateInput = screen.getByDisplayValue('')
      expect(dateInput).toHaveAttribute('type', 'date')
    })

    it('allows date selection', () => {
      render(<ChartToolbar />)
      
      const dateInput = screen.getByDisplayValue('')
      const testDate = '2024-01-15'
      
      fireEvent.change(dateInput, { target: { value: testDate } })
      expect(dateInput).toHaveValue(testDate)
    })
  })

  describe('Language Selection', () => {
    it('shows language options', () => {
      render(<ChartToolbar />)
      
      const languageSelect = screen.getByDisplayValue('English')
      fireEvent.click(languageSelect)
      
      // Check for language options
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('हिंदी')).toBeInTheDocument()
      expect(screen.getByText('संस्कृत')).toBeInTheDocument()
      expect(screen.getByText('中文')).toBeInTheDocument()
      expect(screen.getByText('日本語')).toBeInTheDocument()
    })
  })

  describe('Theme Toggle', () => {
    it('renders theme toggle button', () => {
      render(<ChartToolbar />)
      
      const themeButton = screen.getByRole('button', { name: /theme/i })
      expect(themeButton).toBeInTheDocument()
    })

    it('has proper theme toggle styling', () => {
      render(<ChartToolbar />)
      
      const themeButton = screen.getByRole('button', { name: /theme/i })
      expect(themeButton).toHaveClass('p-2', 'rounded-md')
    })
  })

  describe('Action Buttons', () => {
    it('renders save button with proper styling', () => {
      render(<ChartToolbar />)
      
      const saveButton = screen.getByText('Save')
      expect(saveButton).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders print button with proper styling', () => {
      render(<ChartToolbar />)
      
      const printButton = screen.getByText('Print')
      expect(printButton).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('handles button clicks', () => {
      render(<ChartToolbar />)
      
      const saveButton = screen.getByText('Save')
      const printButton = screen.getByText('Print')
      
      fireEvent.click(saveButton)
      fireEvent.click(printButton)
      
      // Buttons should be clickable
      expect(saveButton).toBeInTheDocument()
      expect(printButton).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('uses proper flexbox layout', () => {
      render(<ChartToolbar />)
      
      const toolbar = screen.getByText('System').closest('div')
      expect(toolbar).toHaveClass('flex', 'flex-wrap', 'gap-4')
    })

    it('applies consistent spacing', () => {
      render(<ChartToolbar />)
      
      const controls = screen.getAllByRole('combobox')
      controls.forEach(control => {
        expect(control).toHaveClass('w-32')
      })
    })

    it('has proper responsive design', () => {
      render(<ChartToolbar />)
      
      const toolbar = screen.getByText('System').closest('div')
      expect(toolbar).toHaveClass('flex-wrap')
    })
  })

  describe('Accessibility', () => {
    it('has proper labels for all controls', () => {
      render(<ChartToolbar />)
      
      expect(screen.getByLabelText('System')).toBeInTheDocument()
      expect(screen.getByLabelText('Ayanamsha')).toBeInTheDocument()
      expect(screen.getByLabelText('House System')).toBeInTheDocument()
      expect(screen.getByLabelText('Chart Style')).toBeInTheDocument()
    })

    it('provides proper button accessibility', () => {
      render(<ChartToolbar />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })
  })

  describe('Integration', () => {
    it('updates store values when controls change', async () => {
      const mockSetSystem = jest.fn()
      const mockSetAyanamsha = jest.fn()
      const mockSetHouseSystem = jest.fn()
      const mockSetChartStyle = jest.fn()

      jest.doMock('@/lib/store/chart-store', () => ({
        useChartStore: () => ({
          system: 'vedic',
          ayanamsha: 'lahiri',
          houseSystem: 'placidus',
          chartStyle: 'north',
          setSystem: mockSetSystem,
          setAyanamsha: mockSetAyanamsha,
          setHouseSystem: mockSetHouseSystem,
          setChartStyle: mockSetChartStyle,
        }),
      }))

      render(<ChartToolbar />)
      
      // Change system
      const systemSelect = screen.getByDisplayValue('vedic')
      fireEvent.change(systemSelect, { target: { value: 'western' } })
      
      // Change ayanamsha
      const ayanamshaSelect = screen.getByDisplayValue('lahiri')
      fireEvent.change(ayanamshaSelect, { target: { value: 'raman' } })
      
      await waitFor(() => {
        expect(mockSetSystem).toHaveBeenCalledWith('western')
        expect(mockSetAyanamsha).toHaveBeenCalledWith('raman')
      })
    })
  })
})
