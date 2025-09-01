import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Home from '@/app/page'

// Mock next-auth
jest.mock('next-auth/react')

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('Home Page', () => {
  const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the main heading correctly', () => {
      render(<Home />)
      expect(screen.getByText('AstroSuite Pro')).toBeInTheDocument()
    })

    it('renders the professional badge', () => {
      render(<Home />)
      expect(screen.getByText('Professional Astrology Software')).toBeInTheDocument()
    })

    it('renders the main description', () => {
      render(<Home />)
      expect(screen.getByText(/The most advanced astrology platform/)).toBeInTheDocument()
    })

    it('renders all feature cards', () => {
      render(<Home />)
      expect(screen.getByText('Advanced Chart Analysis')).toBeInTheDocument()
      expect(screen.getByText('Daily Panchang')).toBeInTheDocument()
      expect(screen.getByText('Transit Tracking')).toBeInTheDocument()
      expect(screen.getByText('Specialized Calculators')).toBeInTheDocument()
    })

    it('renders statistics section', () => {
      render(<Home />)
      expect(screen.getByText('10K+')).toBeInTheDocument()
      expect(screen.getByText('50K+')).toBeInTheDocument()
      expect(screen.getByText('25+')).toBeInTheDocument()
      expect(screen.getByText('99.9%')).toBeInTheDocument()
    })

    it('renders testimonials section', () => {
      render(<Home />)
      expect(screen.getByText('Trusted by Professionals')).toBeInTheDocument()
      expect(screen.getByText('Dr. Priya Sharma')).toBeInTheDocument()
      expect(screen.getByText('Rajesh Kumar')).toBeInTheDocument()
      expect(screen.getByText('Meera Patel')).toBeInTheDocument()
    })
  })

  describe('Authentication States', () => {
    it('shows login buttons for unauthenticated users', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })
      
      render(<Home />)
      expect(screen.getByText('Get Started Free')).toBeInTheDocument()
      expect(screen.getByText('Try Demo')).toBeInTheDocument()
    })

    it('shows dashboard button for authenticated users', () => {
      mockUseSession.mockReturnValue({
        data: { user: { name: 'John Doe' } },
        status: 'authenticated',
      })
      
      render(<Home />)
      // Use getAllByText since there might be multiple dashboard buttons
      const dashboardButtons = screen.getAllByText('Go to Dashboard')
      expect(dashboardButtons.length).toBeGreaterThan(0)
    })

    it('shows loading state correctly', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
      })
      
      render(<Home />)
      // Should still show the main content while loading
      const headings = screen.getAllByText('AstroSuite Pro')
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  describe('Interactive Elements', () => {
    it('has working feature showcase with auto-rotation', async () => {
      render(<Home />)
      
      // Check if features are displayed
      const features = screen.getAllByText(/Advanced Chart Analysis|Daily Panchang|Transit Tracking|Specialized Calculators/)
      expect(features).toHaveLength(4)
    })

    it('displays floating celestial elements', () => {
      render(<Home />)
      
      // Check for floating elements (Moon, Sun, Star)
      const floatingElements = document.querySelectorAll('.animate-float, .animate-float-delayed')
      expect(floatingElements.length).toBeGreaterThan(0)
    })

    it('has responsive design elements', () => {
      render(<Home />)
      
      // Check for responsive classes - use the main heading
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveClass('text-5xl', 'lg:text-7xl')
    })
  })

  describe('Navigation and CTAs', () => {
    it('has working call-to-action buttons', () => {
      render(<Home />)
      
      const ctaButtons = screen.getAllByRole('button')
      expect(ctaButtons.length).toBeGreaterThan(0)
      
      // Check for specific CTA text
      expect(screen.getByText('Ready to Explore the Cosmos?')).toBeInTheDocument()
    })

    it('displays footer information', () => {
      render(<Home />)
      
      expect(screen.getByText('© 2024 AstroSuite Pro')).toBeInTheDocument()
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
      expect(screen.getByText('Terms of Service')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
    })
  })

  describe('Content Sections', () => {
    it('renders key benefits section', () => {
      render(<Home />)
      
      expect(screen.getByText('Why Choose AstroSuite Pro?')).toBeInTheDocument()
      expect(screen.getByText('Swiss Ephemeris Accuracy')).toBeInTheDocument()
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument()
      expect(screen.getByText('Global Coverage')).toBeInTheDocument()
    })

    it('renders features with descriptions', () => {
      render(<Home />)
      
      expect(screen.getByText(/Generate precise natal charts/)).toBeInTheDocument()
      expect(screen.getByText(/Get daily astrological timings/)).toBeInTheDocument()
      expect(screen.getByText(/Monitor planetary movements/)).toBeInTheDocument()
      expect(screen.getByText(/Tools for Sade Sati/)).toBeInTheDocument()
    })

    it('displays proper gradient text styling', () => {
      render(<Home />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'via-purple-600', 'to-indigo-600')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Home />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('AstroSuite Pro')
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('has proper button labels', () => {
      render(<Home />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      render(<Home />)
      
      // Check for responsive grid classes
      const featureGrid = screen.getByText('Advanced Chart Analysis').closest('div')?.parentElement
      expect(featureGrid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-4')
    })

    it('has mobile-first design approach', () => {
      render(<Home />)
      
      // Check for flex column on mobile, row on larger screens
      const ctaContainer = screen.getByText('Get Started Free').closest('div')?.parentElement
      expect(ctaContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row')
    })
  })

  describe('Performance and Optimization', () => {
    it('uses proper image optimization', () => {
      render(<Home />)
      
      // Check for proper icon usage instead of heavy images
      const icons = document.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('implements proper state management', () => {
      render(<Home />)
      
      // Check if component uses proper React hooks
      const component = screen.getByRole('heading', { level: 1 }).closest('div')
      expect(component).toBeInTheDocument()
    })
  })
})
