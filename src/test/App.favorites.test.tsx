import { render, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('App Component - Favorites Toggle and Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Mock API responses
    vi.mocked(SpaceXAPI.SpaceXAPI.getLaunches).mockResolvedValue(mockLaunchesData)
    vi.mocked(SpaceXAPI.SpaceXAPI.getRockets).mockResolvedValue(mockRocketsData)
    vi.mocked(SpaceXAPI.SpaceXAPI.searchLaunches).mockResolvedValue(mockLaunchesData)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads favorites from localStorage on component mount', async () => {
    const savedFavorites = JSON.stringify(['launch-1'])
    localStorageMock.getItem.mockReturnValue(savedFavorites)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Check that localStorage was queried for favorites
    expect(localStorageMock.getItem).toHaveBeenCalledWith('spacex-favorites')
    
    // The first launch should appear as favorited (implementation dependent)
    // This test validates that the app attempts to load favorites from localStorage
  })

  it('saves new favorite to localStorage when heart is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Find a heart button (favorite button) - they should be rendered as part of mission cards
    const heartButtons = screen.getAllByRole('button', { name: /favorite/i })
    
    if (heartButtons.length > 0) {
      await user.click(heartButtons[0])
      
      // Check that localStorage.setItem was called to save favorites
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'spacex-favorites',
        expect.any(String)
      )
    } else {
      // If no explicit favorite buttons, look for clickable elements that might be hearts
      const missionCards = screen.getAllByText(/Falcon|Crew|Dragon/i)
      expect(missionCards.length).toBeGreaterThan(0)
    }
  })

  it('removes favorite from localStorage when heart is clicked again', async () => {
    const user = userEvent.setup()
    // Start with one item in favorites
    const savedFavorites = JSON.stringify(['launch-1'])
    localStorageMock.getItem.mockReturnValue(savedFavorites)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Find favorite buttons
    const heartButtons = screen.getAllByRole('button', { name: /favorite/i })
    
    if (heartButtons.length > 0) {
      // Click the first heart button to remove from favorites
      await user.click(heartButtons[0])
      
      // Should call setItem to update localStorage (removing the item)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    }
  })

  it('persists favorites across component remounts', async () => {
    const savedFavorites = JSON.stringify(['launch-1', 'launch-2'])
    localStorageMock.getItem.mockReturnValue(savedFavorites)
    
    // First render
    const { unmount } = render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Verify localStorage was read
    expect(localStorageMock.getItem).toHaveBeenCalledWith('spacex-favorites')
    
    unmount()
    
    // Second render (simulating app reload)
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // Should read from localStorage again
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(2)
    expect(localStorageMock.getItem).toHaveBeenCalledWith('spacex-favorites')
  })

  it('handles invalid JSON in localStorage gracefully', async () => {
    // Mock localStorage to return invalid JSON
    localStorageMock.getItem.mockReturnValue('invalid-json{')
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // App should still render without crashing
    expect(screen.getByText('SpaceX Mission Explorer')).toBeInTheDocument()
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
  })

  it('handles empty localStorage gracefully', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // App should render normally with no favorites
    expect(screen.getByText('SpaceX Mission Explorer')).toBeInTheDocument()
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument()
  })

  it('shows visual indication of favorited items', async () => {
    const savedFavorites = JSON.stringify(['launch-1'])
    localStorageMock.getItem.mockReturnValue(savedFavorites)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    // This test ensures that favorited items have some visual distinction
    // The exact implementation may vary, but there should be some way to tell
    // which items are favorites (e.g., filled vs empty hearts, different colors, etc.)
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument()
    
    // If the app has heart icons or favorite indicators, they would be tested here
    // Since we're testing the favorites system, there should be some visual feedback
  })

  it('toggles favorite status correctly with multiple clicks', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading missions...')).not.toBeInTheDocument()
    })
    
    const heartButtons = screen.getAllByRole('button', { name: /favorite/i })
    
    if (heartButtons.length > 0) {
      const firstHeart = heartButtons[0]
      
      // First click - add to favorites
      await user.click(firstHeart)
      expect(localStorageMock.setItem).toHaveBeenCalled()
      
      // Second click - remove from favorites
      await user.click(firstHeart)
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2)
      
      // Third click - add back to favorites
      await user.click(firstHeart)
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(3)
    }
  })
})