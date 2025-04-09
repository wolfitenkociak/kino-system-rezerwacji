"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  imageUrl: string | null;
  releaseDate: string;
}

export default function HomePage() {
  const { fetchData, isLoading } = useFetch();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchData<Movie[]>('/api/movies', {
        errorMessage: "Failed to load movies"
      });
      
      if (data) {
        setMovies(data);
      }
    };

    getMovies();
  }, [fetchData]);

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Cinema Fanth - Premieres</h1>
      
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No movies available right now.</p>
          <p>Check back later for our newest premieres!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="border rounded-md overflow-hidden shadow-sm">
              <div className="aspect-video relative bg-gray-100">
                {movie.imageUrl ? (
                  <img 
                    src={movie.imageUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-2">
                  Duration: {movie.duration} min | Release: {new Date(movie.releaseDate).toLocaleDateString()}
                </p>
                <p className="line-clamp-3 mb-4">{movie.description}</p>
                <Link 
                  href={`/movie/${movie.id}`}
                  className="block w-full text-center bg-primary text-primary-foreground rounded-md py-2"
                >
                  Book tickets
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
