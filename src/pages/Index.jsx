import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Index = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

    const fetchTrendingMovies = async (page) => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzlmNzBiYzE3NWUwMzViYmNkMDVmYmI1MzI4OGE0NyIsIm5iZiI6MTcxOTgyNzUwMS40MTQ0NjQsInN1YiI6IjY2ODI3YWRiNzVlOWZhMmNmMzkyODAzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AoqxCfHRacX-JCzlco4jxf35-p5H1QysNjFGzcMi3w4'
        }
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?page=${page}`, options);
        const data = await response.json();
        const moviesWithActors = await Promise.all(data.results.map(async (movie) => {
          const actorsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, options);
          const actorsData = await actorsResponse.json();
          return { ...movie, actors: actorsData.cast.slice(0, 3) }; // Get top 3 actors
        }));
        setMovies((prevMovies) => [...prevMovies, ...moviesWithActors]);
        setHasMore(data.page < data.total_pages);
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
    fetchTrendingMovies(page);
    fetchGenres();
  }, [page]);

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

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchMovieDetails = async (movieId) => {
    setLoadingDetails(true);
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzlmNzBiYzE3NWUwMzViYmNkMDVmYmI1MzI4OGE0NyIsIm5iZiI6MTcxOTgyNzUwMS40MTQ0NjQsInN1YiI6IjY2ODI3YWRiNzVlOWZhMmNmMzkyODAzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AoqxCfHRacX-JCzlco4jxf35-p5H1QysNjFGzcMi3w4'
      }
    };

    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options);
      const data = await response.json();
      const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, options);
      const creditsData = await creditsResponse.json();
      const reviewsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews`, options);
      const reviewsData = await reviewsResponse.json();
      const director = creditsData.crew.find((member) => member.job === 'Director');
      setMovieDetails({
        ...data,
        director: director ? director.name : 'N/A',
        cast: creditsData.cast,
        reviews: reviewsData.results,
      });
    } catch (err) {
      toast.error('Failed to fetch movie details');
    } finally {
      setLoadingDetails(false);
    }
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
              <div>
                <h3 className="mt-2 font-semibold">Main Actors:</h3>
                <ul>
                  {movie.actors.map((actor) => (
                    <li key={actor.id}>{actor.name}</li>
                  ))}
                </ul>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => { setSelectedMovie(movie); fetchMovieDetails(movie.id); }}>View More</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{selectedMovie?.title}</DialogTitle>
                  </DialogHeader>
                  {loadingDetails ? (
                    <p>Loading...</p>
                  ) : (
                    movieDetails && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">Overview</h3>
                          <p>{movieDetails.overview}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Director</h3>
                          <p>{movieDetails.director}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Full Cast</h3>
                          <ul className="list-disc list-inside">
                            {movieDetails.cast.map((actor) => (
                              <li key={actor.id}>{actor.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Reviews</h3>
                          <ul className="list-disc list-inside">
                            {movieDetails.reviews.map((review) => (
                              <li key={review.id}>{review.content}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={loadMoreMovies}>Load More</Button>
        </div>
      )}
    </div>
  );
};

export default Index;