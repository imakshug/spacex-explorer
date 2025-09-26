import { useState, useEffect } from 'react'
import { SpaceXAPI } from './services/spacex-api'
import type { SpaceXLaunch, SpaceXRocket } from './types/spacex'

function App() {
  const [launches, setLaunches] = useState<SpaceXLaunch[]>([]);
  const [rockets, setRockets] = useState<SpaceXRocket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both launches and rockets concurrently
        const [launchData, rocketData] = await Promise.all([
          SpaceXAPI.getLaunches({ 
            limit: 12, 
            sort: 'date_utc', 
            order: 'desc' 
          }),
          SpaceXAPI.getRockets()
        ]);
        
        setLaunches(launchData);
        setRockets(rocketData);
      } catch (err) {
        setError('Failed to fetch SpaceX data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRocketName = (rocketId: string) => {
    const rocket = rockets.find(r => r.id === rocketId);
    return rocket ? rocket.name : 'Unknown Rocket';
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            SpaceX Mission Explorer
          </h1>
          <p className="text-gray-600 mt-1">
            Fetch real data from the SpaceX public API. Filter, explore, and favorite launches.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by mission name
              </label>
              <input
                type="text"
                id="search"
                placeholder="e.g., Starlink, CRS, Demo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Year Filter */}
            <div className="w-full lg:w-48">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show favorites</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Successful only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Missions Grid */}
                {/* Missions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4 animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-shimmer"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-shimmer"></div>
                    <div className="h-6 bg-gray-200 rounded w-12 animate-shimmer"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-medium mb-2">Error Loading Launches</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {launches.map((launch) => (
              <div key={launch.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all-smooth transform hover:scale-105">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      {launch.links.patch.small && (
                        <img 
                          src={launch.links.patch.small} 
                          alt={`${launch.name} mission patch`}
                          className="w-12 h-12 object-contain flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{launch.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatDate(launch.date_utc)} · {getRocketName(launch.rocket)}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-yellow-500 flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Flight #{launch.flight_number}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      launch.success === true 
                        ? 'bg-green-100 text-green-800' 
                        : launch.success === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {launch.upcoming ? 'Upcoming' : launch.success === true ? 'Success' : launch.success === false ? 'Failed' : 'TBD'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {new Date(launch.date_utc).getFullYear()}
                    </span>
                    {launch.crew.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        👨‍🚀 Crew ({launch.crew.length})
                      </span>
                    )}
                  </div>

                  {launch.details && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {launch.details}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    {launch.links.wikipedia && (
                      <a
                        href={launch.links.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                      >
                        📖 Wiki
                      </a>
                    )}
                    {launch.links.youtube_id && (
                      <a
                        href={`https://www.youtube.com/watch?v=${launch.links.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded transition-colors"
                      >
                        🎥 Watch
                      </a>
                    )}
                    {launch.links.presskit && (
                      <a
                        href={launch.links.presskit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded transition-colors"
                      >
                        📄 Press
                      </a>
                    )}
                    {launch.links.article && (
                      <a
                        href={launch.links.article}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded transition-colors"
                      >
                        📰 News
                      </a>
                    )}
                    <button className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-700 text-xs font-medium">
                      More details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            Prev
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page 1 of 18
          </span>
          <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            Next
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
