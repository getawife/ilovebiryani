'use client';

import Link from 'next/link';
import { Play, Star } from 'lucide-react';

export function MovieCard({ item, type, accentColor = '#22c55e', fixedWidth = true }) {
  if (!item) return null;

  const mediaType = item.media_type || item.type || type || 'movie';
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').split('-')[0];
  const rating = item.vote_average ? item.vote_average.toFixed(1) : (item.rating || '0.0');

  const isContinueWatching = item.season !== undefined && item.episode !== undefined;

  return (
    <Link
      href={`/watch/${mediaType}/${item.id}`}
      className={`group block text-left no-underline select-none ${
        fixedWidth ? 'w-[160px] sm:w-[185px] shrink-0' : 'w-full'
      }`}
    >
      <div className="streaming-card bg-surface rounded-lg overflow-hidden border border-border flex flex-col h-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-hover">
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="card-poster-img w-full h-full object-cover block"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-surface">
              <span className="font-display text-xl text-text-muted mb-1">NO POSTER</span>
              <span className="text-xs text-text-muted line-clamp-2">{title}</span>
            </div>
          )}

          {!isContinueWatching && rating !== '0.0' && (
            <div className="absolute top-2.5 left-2.5 card-badge-pill">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-primary text-black flex items-center justify-center">
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </div>

        <div className="p-3 flex flex-col flex-1 justify-between gap-1.5 bg-surface">
          <h3 className="text-sm font-bold text-text-main line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-text-sub">
            {isContinueWatching ? (
              <span className="text-amber-400 font-semibold text-xs">
                S{item.season} · E{item.episode}
              </span>
            ) : (
              <span className="text-text-muted font-medium">{year || '—'}</span>
            )}
            {isContinueWatching && (
              <span className="text-xs text-primary font-bold uppercase tracking-wider">
                Resume
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
