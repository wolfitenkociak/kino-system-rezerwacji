"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import { useToast } from "@/hooks/use-toast"

interface Movie {
  id: string
  title: string
  description: string
  duration: number
  imageUrl: string | null
  releaseDate: string
}

interface Screening {
  id: string
  movieId: string
  date: string
  hall: string
  movie: Movie
}

export default function AdminPage() {
  const { user, isLoading: authLoading, logout } = useAuth()
  const { fetchData, isLoading: fetchLoading } = useFetch()
  const [movies, setMovies] = useState<Movie[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("movies")
  
  useEffect(() => {
    // Redirect if not an admin
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
    
    // Load data when authenticated
    if (user) {
      loadData()
    }
  }, [user, authLoading])
  
  const loadData = async () => {
    const moviesData = await fetchData<Movie[]>("/api/movies")
    if (moviesData) {
      setMovies(moviesData)
    }
    
    const screeningsData = await fetchData<Screening[]>("/api/screenings")
    if (screeningsData) {
      setScreenings(screeningsData)
    }
  }
  
  const handleLogout = async () => {
    await logout()
    toast({
      title: "Success",
      description: "Logged out successfully",
    })
    router.push("/admin/login")
  }
  
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "movies"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("movies")}
              >
                Movies
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "screenings"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("screenings")}
              >
                Screenings
              </button>
            </nav>
          </div>
        </div>
        
        {fetchLoading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading data...</p>
          </div>
        ) : activeTab === "movies" ? (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Movies List</h2>
              <button 
                className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
                onClick={() => toast({
                  title: "Add Movie",
                  description: "This feature is not implemented yet."
                })}
              >
                Add Movie
              </button>
            </div>
            
            {movies.length === 0 ? (
              <p className="text-center py-12 text-gray-500">No movies found</p>
            ) : (
              <div className="bg-white shadow overflow-hidden rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movies.map((movie) => (
                      <tr key={movie.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{movie.duration} min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(movie.releaseDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary/80 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Screenings List</h2>
              <button 
                className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
                onClick={() => toast({
                  title: "Add Screening",
                  description: "This feature is not implemented yet."
                })}
              >
                Add Screening
              </button>
            </div>
            
            {screenings.length === 0 ? (
              <p className="text-center py-12 text-gray-500">No screenings found</p>
            ) : (
              <div className="bg-white shadow overflow-hidden rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {screenings.map((screening) => (
                      <tr key={screening.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{screening.movie.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(screening.date).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{screening.hall}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary/80 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
