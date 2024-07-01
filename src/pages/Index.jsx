import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzlmNzBiYzE3NWUwMzViYmNkMDVmYmI1MzI4OGE0NyIsIm5iZiI6MTcxOTgyNzUwMS40MTQ0NjQsInN1YiI6IjY2ODI3YWRiNzVlOWZhMmNmMzkyODAzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AoqxCfHRacX-JCzlco4jxf35-p5H1QysNjFGzcMi3w4'
        }
      };

      try {
        const response = await fetch('https://api.themoviedb.org/3/configuration', options);
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTrendingMovies = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzlmNzBiYzE3NWUwMzViYmNkMDVmYmI1MzI4OGE0NyIsIm5iZiI6MTcxOTgyNzUwMS40MTQ0NjQsInN1YiI6IjY2ODI3YWRiNzVlOWZhMmNmMzkyODAzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AoqxCfHRacX-JCzlco4jxf35-p5H1QysNjFGzcMi3w4'
        }
      };

      try {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/week', options);
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
    fetchTrendingMovies();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-screen w-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-8">Trending Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Card key={movie.id} className="h-full">
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Release Date: {movie.release_date}</p>
              <p>Rating: {movie.vote_average}</p>
              {config && (
                <img
                  src={`${config.images.secure_base_url}${config.images.poster_sizes[2]}${movie.poster_path}`}
                  alt={movie.title}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;