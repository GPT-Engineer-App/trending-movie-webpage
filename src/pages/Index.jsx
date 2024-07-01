import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const Index = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);

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

    const fetchGenres = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzlmNzBiYzE3NWUwMzViYmNkMDVmYmI1MzI4OGE0NyIsIm5iZiI6MTcxOTgyNzUwMS40MTQ0NjQsInN1YiI6IjY2ODI3YWRiNzVlOWZhMmNmMzkyODAzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AoqxCfHRacX-JCzlco4jxf35-p5H1QysNjFGzcMi3w4'
        }
      };

      try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', options);
        const data = await response.json();
        setGenres(data.genres);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchConfig();
    fetchTrendingMovies();
    fetchGenres();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (value) => {
    setSortOption(value);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genreId)
        ? prevSelectedGenres.filter((id) => id !== genreId)
        : [...prevSelectedGenres, genreId]
    );
  };

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((movie) =>
      selectedGenres.length === 0 ||
      movie.genre_ids.some((genreId) => selectedGenres.includes(genreId))
    )
    .sort((a, b) => {
      if (sortOption === 'release_date') {
        return new Date(b.release_date) - new Date(a.release_date);
      } else if (sortOption === 'rating') {
        return b.vote_average - a.vote_average;
      } else if (sortOption === 'popularity') {
        return b.popularity - a.popularity;
      } else {
        return 0;
      }
    });

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-screen w-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-8">Trending Movies</h1>
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <Input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-1/3"
        />
        <Select onValueChange={handleSort}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="release_date">Release Date</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap space-x-2">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre.id}`}
                checked={selectedGenres.includes(genre.id)}
                onCheckedChange={() => handleGenreChange(genre.id)}
              />
              <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMovies.map((movie) => (
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