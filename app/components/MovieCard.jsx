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
        fixedWidth ? 'w-[150px] sm:w-[170px] shrink-0' : 'w-full'
      }`}
    >
      <div className="streaming-card bg-[#0e120e] rounded-md overflow-hidden border border-white/[0.07] flex flex-col h-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#141a14]">
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="card-poster-img w-full h-full object-cover block"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#111611]">
              <span className="font-display text-xl text-[#5e5952] mb-1">NO POSTER</span>
              <span className="text-[10px] text-[#5e5952] line-clamp-2">{title}</span>
            </div>
          )}

          {!isContinueWatching && rating !== '0.0' && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-white/[0.08]">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#F4B942] text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-200 shadow-lg shadow-black/60">
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </div>
          </div>

 
        </div>

        <div className="p-2.5 flex flex-col flex-1 justify-between gap-1">
          <h3 className="text-xs font-semibold text-[#f3ede2] line-clamp-1 group-hover:text-[#F4B942] transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-[#9e988f]">
            {isContinueWatching ? (
              <span className="text-amber-400 font-medium text-[10px]">
                S{item.season} · E{item.episode}
              </span>
            ) : (
              <span>{year || '—'}</span>
            )}
            {isContinueWatching && (
              <span className="text-[10px] text-[#F4B942] font-semibold uppercase tracking-wider">
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
