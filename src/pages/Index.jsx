import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        setMovies(response.data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;