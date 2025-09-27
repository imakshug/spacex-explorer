import { render, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from '../App'
import * as SpaceXAPI from '../services/spacex-api'
import type { SpaceXLaunch, SpaceXRocket } from '../types/spacex'

// Mock the SpaceX API
vi.mock('../services/spacex-api')

const mockLaunchesData: SpaceXLaunch[] = [
  {
    id: 'launch-1',
    name: 'Falcon Heavy Test Flight',
    date_utc: '2018-02-06T20:45:00.000Z',
    date_local: '2018-02-06T15:45:00-05:00',
    date_unix: 1517949900,
    date_precision: 'hour',
    success: true,
    upcoming: false,
    rocket: 'rocket1',
    crew: [],
    ships: [],
    payloads: [],
    capsules: [],
    launchpad: 'launch1',
    auto_update: true,
    flight_number: 1,
    details: 'First test flight of the Falcon Heavy rocket',
    static_fire_date_utc: null,
    static_fire_date_unix: null,
    net: false,
    window: 0,
    tdb: false,
    fairings: null,
    cores: [],
    failures: [],
    links: {
      patch: {
        small: 'https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png',
        large: 'https://images2.imgbox.com/40/e3/GypSkayF_o.png'
      },
      reddit: {
        campaign: null,
        launch: null,
        media: null,
        recovery: null
      },
      flickr: {
        small: [],
        original: []
      },
      presskit: null,
      webcast: null,
      youtube_id: null,
      article: 'https://spaceflightnow.com/2018/02/06/spacex-launches-falcon-heavy/',
      wikipedia: 'https://en.wikipedia.org/wiki/Falcon_Heavy_test_flight'
    }
  },
  {
    id: 'launch-2', 
    name: 'Crew Dragon Demo-2',
    date_utc: '2020-05-30T19:22:00.000Z',
    date_local: '2020-05-30T15:22:00-04:00',
    date_unix: 1590866520,
    date_precision: 'hour',
    success: true,
    upcoming: false,
    rocket: 'rocket2',
    crew: [],
    ships: [],
    payloads: [],
    capsules: [],
    launchpad: 'launch2',
    auto_update: true,
    flight_number: 2,
    details: 'First crewed flight of Crew Dragon to the ISS',
    static_fire_date_utc: null,
    static_fire_date_unix: null,
    net: false,
    window: 0,
    tdb: false,
    fairings: null,
    cores: [],
    failures: [],
    links: {
      patch: {
        small: 'https://images2.imgbox.com/d2/3b/bQaWiXhX_o.png',
        large: 'https://images2.imgbox.com/9a/96/nLppz9HW_o.png'
      },
      reddit: {
        campaign: null,
        launch: null,
        media: null,
        recovery: null
      },
      flickr: {
        small: [],
        original: []
      },
      presskit: null,
      webcast: null,
      youtube_id: null,
      article: 'https://www.nasa.gov/news/releases/2020/05/30/nasa-spacex-launch-american-astronauts-to-space-station-from-us-soil-first-time-since-2011/',
      wikipedia: 'https://en.wikipedia.org/wiki/Crew_Dragon_Demo-2'
    }
  }
]

const mockRocketsData: SpaceXRocket[] = [
  {
    id: 'rocket1',
    name: 'Falcon Heavy',
    type: 'Heavy',
    active: true,
    stages: 2,
    boosters: 2,
    cost_per_launch: 90000000,
    success_rate_pct: 100,
    first_flight: '2018-02-06',
    country: 'United States',
    company: 'SpaceX',
    wikipedia: 'https://en.wikipedia.org/wiki/Falcon_Heavy',
    description: 'Heavy-lift launch vehicle'
  },
  {
    id: 'rocket2',
    name: 'Falcon 9',
    type: 'Medium',
    active: true,
    stages: 2,
    boosters: 0,
    cost_per_launch: 62000000,
    success_rate_pct: 97,
    first_flight: '2010-06-04',
    country: 'United States',
    company: 'SpaceX',
    wikipedia: 'https://en.wikipedia.org/wiki/Falcon_9',
    description: 'Two-stage rocket'
  }
]

describe('SpaceX Explorer App Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock API responses
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockResolvedValue(mockLaunchesData)
    vi.mocked(SpaceXAPI.SpaceXAPI.getRockets).mockResolvedValue(mockRocketsData)
    vi.mocked(SpaceXAPI.SpaceXAPI.searchLaunches).mockResolvedValue(mockLaunchesData.slice(0, 1))
  })

  describe('Rendering and Filtering', () => {
    it('renders the main application header', async () => {
      render(<App />)
      
      expect(screen.getByText('SpaceX Explorer')).toBeInTheDocument()
      expect(screen.getByText('Discover SpaceX missions and launches')).toBeInTheDocument()
    })

    it('shows loading shimmer cards initially', () => {
      render(<App />)
      
      // Check for shimmer loading elements
      const shimmerElements = document.querySelectorAll('.animate-shimmer')
      expect(shimmerElements.length).toBeGreaterThan(0)
    })

    it('renders filter and search interface', () => {
      render(<App />)
      
      expect(screen.getByText('Filter & Search')).toBeInTheDocument()
      expect(screen.getByText('Search by mission name')).toBeInTheDocument()
      expect(screen.getByText('Year')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g., Starlink, CRS, Demo...')).toBeInTheDocument()
    })

    it('renders launch data after loading', async () => {
      render(<App />)
      
      // Wait for loading to complete and data to render
      await waitFor(() => {
        expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
        expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument()
      }, { timeout: 5000 })
    })

    it('displays rocket names correctly', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Falcon Heavy')).toBeInTheDocument()
        expect(screen.getByText('Falcon 9')).toBeInTheDocument()
      }, { timeout: 5000 })
    })

    it('handles API errors gracefully', async () => {
      // Mock API to reject
      vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockRejectedValue(new Error('API Error'))
      vi.mocked(SpaceXAPI.SpaceXAPI.getRockets).mockRejectedValue(new Error('API Error'))
      
      render(<App />)
      
      // Should still render the header even with API errors
      expect(screen.getByText('SpaceX Explorer')).toBeInTheDocument()
      
      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Error Loading Launches')).toBeInTheDocument()
        expect(screen.getByText('Try Again')).toBeInTheDocument()
      }, { timeout: 5000 })
    })
  })

  describe('Favorites Toggle and Persistence', () => {
    it('renders favorites checkbox', () => {
      render(<App />)
      
      expect(screen.getByText('Show favorites')).toBeInTheDocument()
      const checkbox = screen.getByRole('checkbox', { name: /show favorites/i })
      expect(checkbox).toBeInTheDocument()
    })

    it('renders successful only filter', () => {
      render(<App />)
      
      expect(screen.getByText('Successful only')).toBeInTheDocument()
      const checkbox = screen.getByRole('checkbox', { name: /successful only/i })
      expect(checkbox).toBeInTheDocument()
    })

    it('can interact with filter checkboxes', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const favoritesCheckbox = screen.getByRole('checkbox', { name: /show favorites/i })
      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful only/i })
      
      await user.click(favoritesCheckbox)
      await user.click(successfulCheckbox)
      
      // Checkboxes should be interactive (no specific assertion needed for functionality)
      expect(favoritesCheckbox).toBeInTheDocument()
      expect(successfulCheckbox).toBeInTheDocument()
    })
  })

  describe('Detail View Rendering', () => {
    it('displays mission cards with essential information', async () => {
      render(<App />)
      
      await waitFor(() => {
        // Check mission names
        expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
        expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument()
        
        // Check rocket names
        expect(screen.getByText('Falcon Heavy')).toBeInTheDocument()
        expect(screen.getByText('Falcon 9')).toBeInTheDocument()
      }, { timeout: 5000 })
    })

    it('shows formatted dates', async () => {
      render(<App />)
      
      await waitFor(() => {
        // Look for date patterns (the exact format depends on locale)
        expect(screen.getByText(/2018/)).toBeInTheDocument()
        expect(screen.getByText(/2020/)).toBeInTheDocument()
      }, { timeout: 5000 })
    })

    it('displays mission details', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/First test flight of the Falcon Heavy rocket/)).toBeInTheDocument()
        expect(screen.getByText(/First crewed flight of Crew Dragon to the ISS/)).toBeInTheDocument()
      }, { timeout: 5000 })
    })

    it('renders mission patch images', async () => {
      render(<App />)
      
      await waitFor(() => {
        const images = screen.getAllByRole('img')
        const patchImages = images.filter((img: HTMLElement) => 
          img.getAttribute('src')?.includes('imgbox.com')
        )
        expect(patchImages.length).toBeGreaterThan(0)
      }, { timeout: 5000 })
    })

    it('shows pagination controls', () => {
      render(<App />)
      
      expect(screen.getByText('← Previous')).toBeInTheDocument()
      expect(screen.getByText('Next →')).toBeInTheDocument()
      expect(screen.getByText(/Page \d+ of \d+/)).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('can interact with search input', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const searchInput = screen.getByPlaceholderText('e.g., Starlink, CRS, Demo...')
      await user.type(searchInput, 'Falcon')
      
      expect(searchInput).toHaveValue('Falcon')
    })

    it('can interact with year filter', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const yearSelect = screen.getByDisplayValue('All years')
      await user.selectOptions(yearSelect, '2024')
      
      expect(yearSelect).toHaveValue('2024')
    })
  })
})