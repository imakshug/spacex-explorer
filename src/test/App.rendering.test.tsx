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
    id: '1',
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
    id: '2', 
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

describe('App Component - Rendering and Filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock API responses
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockResolvedValue(mockLaunchesData)
    vi.mocked(SpaceXAPI.SpaceXAPI.getRockets).mockResolvedValue(mockRocketsData)
    vi.mocked(SpaceXAPI.SpaceXAPI.searchLaunches).mockResolvedValue(mockLaunchesData.slice(0, 1))
  })

  it('renders the SpaceX Explorer title', async () => {
    render(<App />)
    
    expect(screen.getByText('SpaceX Explorer')).toBeInTheDocument()
    expect(screen.getByText('Discover SpaceX missions and launches')).toBeInTheDocument()
  })

  it('renders loading state initially', () => {
    render(<App />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the list of launches after data loads', async () => {
    render(<App />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check if launches are rendered
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument()
    expect(screen.getByText('Starship SN15 Test')).toBeInTheDocument()
  })

  it('displays rocket names correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    expect(screen.getByText('Falcon Heavy')).toBeInTheDocument()
    expect(screen.getByText('Falcon 9')).toBeInTheDocument()
    expect(screen.getByText('Starship')).toBeInTheDocument()
  })

  it('shows success/failure status correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Success missions should show green checkmark
    const successCards = screen.getAllByText('✓')
    expect(successCards).toHaveLength(2) // Two successful missions
    
    // Failed mission should show red X  
    const failureCards = screen.getAllByText('✗')
    expect(failureCards).toHaveLength(1) // One failed mission
  })

  it('filters launches when search is performed', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Find and interact with search input
    const searchInput = screen.getByPlaceholderText('Search missions...')
    await user.type(searchInput, 'Falcon Heavy')
    
    // Wait for search results
    await waitFor(() => {
      expect(vi.mocked(SpaceXAPI.SpaceXAPI.searchLaunches)).toHaveBeenCalledWith('Falcon Heavy')
    })
  })

  it('handles API errors gracefully', async () => {
    // Mock API to reject
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockRejectedValue(new Error('API Error'))
    vi.mocked(SpaceXAPI.SpaceXAPI.getRockets).mockRejectedValue(new Error('API Error'))
    
    render(<App />)
    
    // Should still render the title even with API errors
    expect(screen.getByText('SpaceX Mission Explorer')).toBeInTheDocument()
    
    // Loading should eventually disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('renders external links correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check for Wikipedia and Article links
    const wikipediaLinks = screen.getAllByText('Wikipedia')
    const articleLinks = screen.getAllByText('Article')
    
    expect(wikipediaLinks.length).toBeGreaterThan(0)
    expect(articleLinks.length).toBeGreaterThan(0)
    
    // Verify links have correct attributes
    wikipediaLinks.forEach((link: HTMLElement) => {
      expect(link.closest('a')).toHaveAttribute('target', '_blank')
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})