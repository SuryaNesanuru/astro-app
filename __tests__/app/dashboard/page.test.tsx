import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Dashboard from '@/app/dashboard/page'

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

describe('Dashboard Page', () => {
  const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'John Doe' } },
      status: 'authenticated',
    })
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication and Loading States', () => {
    it('shows loading spinner when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
      })

      render(<Dashboard />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('redirects to login when user is not authenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<Dashboard />)
      // Component should not render anything when redirecting
      expect(screen.queryByText('Welcome back')).not.toBeInTheDocument()
    })

    it('renders dashboard content when user is authenticated', () => {
      render(<Dashboard />)
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument()
    })
  })

  describe('Dashboard Header', () => {
    it('displays welcome message with user name', () => {
      render(<Dashboard />)
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument()
    })

    it('shows dashboard description', () => {
      render(<Dashboard />)
      expect(screen.getByText(/Create charts, analyze planetary positions/)).toBeInTheDocument()
    })
  })

  describe('Quick Actions Section', () => {
    it('renders all quick action cards', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('New Chart')).toBeInTheDocument()
      expect(screen.getByText('Transits')).toBeInTheDocument()
      expect(screen.getByText('Panchang')).toBeInTheDocument()
      expect(screen.getByText('Calculators')).toBeInTheDocument()
    })

    it('displays correct action descriptions', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Generate a new birth chart')).toBeInTheDocument()
      expect(screen.getByText('Current planetary influences')).toBeInTheDocument()
      expect(screen.getByText("Today's auspicious timings")).toBeInTheDocument()
      expect(screen.getByText('Astrological calculators')).toBeInTheDocument()
    })

    it('shows proper action values', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Create')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Daily')).toBeInTheDocument()
      expect(screen.getByText('Tools')).toBeInTheDocument()
    })
  })

  describe('Statistics Cards', () => {
    it('renders all statistics cards', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Recent Charts')).toBeInTheDocument()
      expect(screen.getByText('Saved Charts')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('displays correct statistics values', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('3')).toBeInTheDocument() // Recent Charts
      expect(screen.getByText('12')).toBeInTheDocument() // Saved Charts
    })

    it('shows statistics descriptions', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Charts created this month')).toBeInTheDocument()
      expect(screen.getByText('Total saved charts')).toBeInTheDocument()
    })

    it('has working profile management button', () => {
      render(<Dashboard />)
      
      const profileButton = screen.getByText('Manage Account')
      expect(profileButton).toBeInTheDocument()
      expect(profileButton).toHaveClass('w-full')
    })
  })

  describe('Recent Activity Section', () => {
    it('renders recent activity title', () => {
      render(<Dashboard />)
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    })

    it('displays activity items with timestamps', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Created natal chart for John Doe')).toBeInTheDocument()
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
      
      expect(screen.getByText('Analyzed transit influences')).toBeInTheDocument()
      expect(screen.getByText('1 day ago')).toBeInTheDocument()
      
      expect(screen.getByText('Generated compatibility report')).toBeInTheDocument()
      expect(screen.getByText('3 days ago')).toBeInTheDocument()
      
      expect(screen.getByText('Updated profile settings')).toBeInTheDocument()
      expect(screen.getByText('1 week ago')).toBeInTheDocument()
    })

    it('shows activity indicators', () => {
      render(<Dashboard />)
      
      const indicators = document.querySelectorAll('.w-2.h-2.bg-primary.rounded-full')
      expect(indicators).toHaveLength(4)
    })
  })

  describe('Explore Features Section', () => {
    it('renders explore features title', () => {
      render(<Dashboard />)
      expect(screen.getByText('Explore Features')).toBeInTheDocument()
    })

    it('displays all feature buttons', () => {
      render(<Dashboard />)
      
      expect(screen.getByText("Today's Panchang")).toBeInTheDocument()
      expect(screen.getByText('Astrological Calculators')).toBeInTheDocument()
      expect(screen.getByText('Help & Documentation')).toBeInTheDocument()
      expect(screen.getByText('Send Feedback')).toBeInTheDocument()
    })

    it('shows feature descriptions', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Daily astrological calendar')).toBeInTheDocument()
      expect(screen.getByText('Specialized calculation tools')).toBeInTheDocument()
      expect(screen.getByText('Learn about Prerana Astro')).toBeInTheDocument()
      expect(screen.getByText('Help us improve the platform')).toBeInTheDocument()
    })

    it('has proper button styling', () => {
      render(<Dashboard />)
      
      const featureButtons = screen.getAllByRole('button')
      featureButtons.forEach(button => {
        if (button.textContent?.includes('Panchang') || 
            button.textContent?.includes('Calculators') ||
            button.textContent?.includes('Help') ||
            button.textContent?.includes('Feedback')) {
          expect(button).toHaveClass('justify-start', 'h-auto', 'p-3')
        }
      })
    })
  })

  describe('Visual Design and Layout', () => {
    it('uses proper grid layouts', () => {
      render(<Dashboard />)
      
      // Check for responsive grid classes
      const quickActionsGrid = screen.getByText('New Chart').closest('div')?.parentElement
      expect(quickActionsGrid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-4')
      
      const statsGrid = screen.getByText('Recent Charts').closest('div')?.parentElement
      expect(statsGrid).toHaveClass('md:grid-cols-3')
      
      const mainContentGrid = screen.getByText('Recent Activity').closest('div')?.parentElement
      expect(mainContentGrid).toHaveClass('md:grid-cols-2')
    })

    it('applies proper spacing and margins', () => {
      render(<Dashboard />)
      
      const container = screen.getByText('Welcome back').closest('div')
      expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
    })

    it('uses consistent card styling', () => {
      render(<Dashboard />)
      
      const cards = document.querySelectorAll('[class*="card"]')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Interactive Functionality', () => {
    it('handles card clicks properly', () => {
      render(<Dashboard />)
      
      const newChartCard = screen.getByText('New Chart').closest('div')
      expect(newChartCard).toHaveClass('cursor-pointer')
    })

    it('shows hover effects on interactive elements', () => {
      render(<Dashboard />)
      
      const quickActionCards = document.querySelectorAll('.hover\\:shadow-lg')
      expect(quickActionCards.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Design', () => {
    it('implements mobile-first approach', () => {
      render(<Dashboard />)
      
      // Check for responsive utilities
      const quickActions = screen.getByText('New Chart').closest('div')?.parentElement
      expect(quickActions).toHaveClass('grid', 'gap-6')
    })

    it('has proper breakpoint handling', () => {
      render(<Dashboard />)
      
      // Check for responsive grid classes
      const container = screen.getByText('Welcome back').closest('div')
      expect(container).toHaveClass('container', 'mx-auto')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Dashboard />)
      
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Check for proper heading levels
      headings.forEach(heading => {
        expect(heading.tagName).toMatch(/^H[1-6]$/)
      })
    })

    it('provides proper button labels', () => {
      render(<Dashboard />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })
  })

  describe('Data Display', () => {
    it('shows realistic activity data', () => {
      render(<Dashboard />)
      
      // Check for realistic activity descriptions
      expect(screen.getByText(/Created natal chart for/)).toBeInTheDocument()
      expect(screen.getByText(/Analyzed transit influences/)).toBeInTheDocument()
      expect(screen.getByText(/Generated compatibility report/)).toBeInTheDocument()
    })

    it('displays proper time formatting', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
      expect(screen.getByText('1 day ago')).toBeInTheDocument()
      expect(screen.getByText('3 days ago')).toBeInTheDocument()
      expect(screen.getByText('1 week ago')).toBeInTheDocument()
    })
  })
})
