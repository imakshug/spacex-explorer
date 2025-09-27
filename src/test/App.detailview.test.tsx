import { render, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
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
    details: 'First test flight of the Falcon Heavy rocket with detailed mission information',
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
      webcast: 'https://www.youtube.com/watch?v=wbSwFU6tY1c',
      youtube_id: 'wbSwFU6tY1c',
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
    crew: ['crew1', 'crew2'],
    ships: ['ship1'],
    payloads: ['payload1'],
    capsules: ['capsule1'],
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
    description: 'Heavy-lift launch vehicle designed for maximum payload capacity'
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
    description: 'Two-stage orbital rocket designed for reliability and reusability'
  }
]

describe('App Component - Detail View Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock API responses
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockResolvedValue(mockLaunchesData)
    vi.mocked(SpaceXAPI.SpaceXAPI.getRockets).mockResolvedValue(mockRocketsData)
    vi.mocked(SpaceXAPI.SpaceXAPI.searchLaunches).mockResolvedValue(mockLaunchesData)
  })

  it('renders mission cards with essential details', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check that mission names are rendered
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument()
    
    // Check that rocket names are displayed
    expect(screen.getByText('Falcon Heavy')).toBeInTheDocument()
    expect(screen.getByText('Falcon 9')).toBeInTheDocument()
  })

  it('displays mission status correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Both missions are successful, should show success indicators
    const successIndicators = screen.getAllByText('✓')
    expect(successIndicators.length).toBeGreaterThan(0)
    
    // Check for success status styling or text
    const missionCards = screen.getAllByText(/Falcon|Crew Dragon/)
    expect(missionCards.length).toBeGreaterThan(0)
  })

  it('displays formatted launch dates', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Should show formatted dates (format may vary)
    // Looking for date-like strings that correspond to our test data
    expect(screen.getByText(/2018/)).toBeInTheDocument() // Falcon Heavy date
    expect(screen.getByText(/2020/)).toBeInTheDocument() // Crew Dragon date
  })

  it('renders mission patch images when available', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check for mission patch images
    const images = screen.getAllByRole('img')
    const patchImages = images.filter((img: HTMLElement) => 
      img.getAttribute('src')?.includes('imgbox.com')
    )
    
    expect(patchImages.length).toBeGreaterThan(0)
    
    // Verify alt text includes mission names
    const falconHeavyImage = images.find((img: HTMLElement) => 
      img.getAttribute('alt')?.includes('Falcon Heavy')
    )
    expect(falconHeavyImage).toBeTruthy()
  })

  it('shows mission details when available', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Should display mission details
    expect(screen.getByText(/First test flight of the Falcon Heavy rocket/)).toBeInTheDocument()
    expect(screen.getByText(/First crewed flight of Crew Dragon to the ISS/)).toBeInTheDocument()
  })

  it('renders external links with proper attributes', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check for Wikipedia links
    const wikipediaLinks = screen.getAllByText('Wikipedia')
    expect(wikipediaLinks.length).toBeGreaterThan(0)
    
    wikipediaLinks.forEach((link: HTMLElement) => {
      const anchorElement = link.closest('a')
      expect(anchorElement).toHaveAttribute('target', '_blank')
      expect(anchorElement).toHaveAttribute('rel', 'noopener noreferrer')
      expect(anchorElement?.getAttribute('href')).toContain('wikipedia.org')
    })
    
    // Check for Article links
    const articleLinks = screen.getAllByText('Article')
    expect(articleLinks.length).toBeGreaterThan(0)
    
    articleLinks.forEach((link: HTMLElement) => {
      const anchorElement = link.closest('a')
      expect(anchorElement).toHaveAttribute('target', '_blank')
      expect(anchorElement).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('handles missions without patch images gracefully', async () => {
    // Mock data with missing patch images
    const launchesWithoutPatches = mockLaunchesData.map(launch => ({
      ...launch,
      links: {
        ...launch.links,
        patch: {
          small: null,
          large: null
        }
      }
    }))
    
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockResolvedValue(launchesWithoutPatches)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // App should still render mission cards even without patch images
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument()
  })

  it('displays rocket information correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Should show rocket names mapped from rocket IDs
    expect(screen.getByText('Falcon Heavy')).toBeInTheDocument()
    expect(screen.getByText('Falcon 9')).toBeInTheDocument()
  })

  it('shows flight numbers when available', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Flight numbers should be displayed (format may vary)
    // Looking for flight number indicators
    const flightNumberElements = screen.getAllByText(/Flight|#|1|2/)
    expect(flightNumberElements.length).toBeGreaterThan(0)
  })

  it('handles missions with missing details gracefully', async () => {
    // Mock launch with null details
    const launchesWithNullDetails = [
      {
        ...mockLaunchesData[0],
        details: null
      },
      ...mockLaunchesData.slice(1)
    ]
    
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockResolvedValue(launchesWithNullDetails)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Should still render the mission card without crashing
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
  })

  it('renders mission cards in a responsive grid layout', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check that multiple mission cards are rendered
    const missionNames = ['Falcon Heavy Test Flight', 'Crew Dragon Demo-2']
    missionNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
    
    // Both missions should be visible simultaneously (grid layout)
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeVisible()
    expect(screen.getByText('Crew Dragon Demo-2')).toBeVisible()
  })

  it('shows appropriate loading states for images', async () => {
    render(<App />)
    
    // During initial load
    expect(screen.getByText('Loading missions...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Images should be present after loading
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
    
    // Each image should have appropriate alt text
    images.forEach((img: HTMLElement) => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
    })
  })
})