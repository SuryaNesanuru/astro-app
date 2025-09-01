// Test setup file for global utilities and mocks
import '@testing-library/jest-dom'

// Global test configuration
beforeAll(() => {
  console.log('Setting up test environment...')
})

afterAll(() => {
  console.log('Cleaning up test environment...')
})

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn
const originalError = console.error
beforeEach(() => {
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterEach(() => {
  console.warn = originalWarn
  console.error = originalError
})

// Test utilities
export const createMockChartData = () => ({
  planets: [
    { name: 'Sun', longitude: 285.5, latitude: 0, distance: 1, speed: 1 },
    { name: 'Moon', longitude: 45.2, latitude: 2, distance: 0.002, speed: 13 },
    { name: 'Mercury', longitude: 275.8, latitude: 1, distance: 0.8, speed: 1.2 },
    { name: 'Venus', longitude: 320.1, latitude: -2, distance: 0.7, speed: 1.1 },
    { name: 'Mars', longitude: 180.3, latitude: 1.5, distance: 1.5, speed: 0.5 },
    { name: 'Jupiter', longitude: 15.7, latitude: 0.5, distance: 5.2, speed: 0.08 },
    { name: 'Saturn', longitude: 330.9, latitude: -1, distance: 9.5, speed: 0.03 },
    { name: 'Rahu', longitude: 90.4, latitude: 0, distance: 0, speed: -0.05 },
    { name: 'Ketu', longitude: 270.4, latitude: 0, distance: 0, speed: -0.05 },
  ],
  houses: [
    { house: 1, longitude: 75.5, sign: 2, degree: 15, minute: 30, second: 0 },
    { house: 2, longitude: 105.5, sign: 3, degree: 15, minute: 30, second: 0 },
    { house: 3, longitude: 135.5, sign: 4, degree: 15, minute: 30, second: 0 },
    { house: 4, longitude: 165.5, sign: 5, degree: 15, minute: 30, second: 0 },
    { house: 5, longitude: 195.5, sign: 6, degree: 15, minute: 30, second: 0 },
    { house: 6, longitude: 225.5, sign: 7, degree: 15, minute: 30, second: 0 },
    { house: 7, longitude: 255.5, sign: 8, degree: 15, minute: 30, second: 0 },
    { house: 8, longitude: 285.5, sign: 9, degree: 15, minute: 30, second: 0 },
    { house: 9, longitude: 315.5, sign: 10, degree: 15, minute: 30, second: 0 },
    { house: 10, longitude: 345.5, sign: 11, degree: 15, minute: 30, second: 0 },
    { house: 11, longitude: 15.5, sign: 0, degree: 15, minute: 30, second: 0 },
    { house: 12, longitude: 45.5, sign: 1, degree: 15, minute: 30, second: 0 },
  ],
  ascendant: 75.5,
  midheaven: 165.5,
  ayanamsha: 24.1467,
})

export const createMockUser = () => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  image: 'https://example.com/avatar.jpg',
})

export const createMockSession = (authenticated = true) => ({
  data: authenticated ? createMockUser() : null,
  status: authenticated ? 'authenticated' : 'unauthenticated',
  update: jest.fn(),
})

export const waitForElementToBeRemoved = (element: Element) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export const mockNextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  query: {},
  pathname: '/',
  asPath: '/',
}

export const mockNextSearchParams = new URLSearchParams()
export const mockNextPathname = '/'
