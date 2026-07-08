import Link from 'next/link';
import Header from './components/header';

async function getMovies(endpoint) {
  const res = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=1`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return res.json();
}

export default async function Home() {
  const [trendingData, popularData] = await Promise.all([
    getMovies('trending/movie/day'),
    getMovies('movie/popular'),
  ]);

  const trendingMovies = trendingData.results.slice(0, 8);
  const popularMovies = popularData.results.slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Header />

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">

        {/* Trending Section */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl tracking-wide uppercase border-b border-muted/10 pb-2">
            Trending Today
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Popular Section */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl tracking-wide uppercase border-b border-muted/10 pb-2">
            Popular Choices
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750/f4f7fa/64748b?text=No+Poster';

  return (
    <Link
      href={`/watch/movie/${movie.id}`}
      className="group block space-y-3 bg-panel rounded-xl overflow-hidden border border-muted/10 transition-all 
           hover:scale-[1.02] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"    >
      <div className="aspect-[2/3] relative w-full overflow-hidden bg-background">
        <img
          src={imageUrl}
          alt={movie.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3 pt-2">
        <h3 className="font-sans font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted mt-1 font-sans">
          <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
          <span className="flex items-center text-primary font-medium">
            ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}
          </span>
        </div>
      </div>
    </Link>
  );
}