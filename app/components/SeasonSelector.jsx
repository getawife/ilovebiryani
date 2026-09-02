'use client';

import { Calendar } from 'lucide-react';

export default function SeasonSelector({ seasons, selectedSeason, onSeasonChange }) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-display text-lg sm:text-xl font-bold text-[#f3ede2] tracking-wider uppercase mb-3 select-none flex items-center gap-2">
        <Calendar size={16} className="text-[#F4B942]" />
        Seasons
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {seasons.map((season) => {
          const posterUrl = season.poster_path
            ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
            : null;
          const isActive = selectedSeason === season.season_number;

          return (
            <button
              key={season.season_number}
              type="button"
              onClick={() => onSeasonChange(season.season_number)}
              className={`group relative rounded-md overflow-hidden aspect-video text-left select-none cursor-pointer transition-all border ${
                isActive
                  ? 'border-[#F4B942] bg-[#162016] ring-1 ring-[#F4B942]'
                  : 'border-white/[0.08] bg-[#0e120e] hover:border-white/20 hover:bg-[#141a14]'
              }`}
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`Season ${season.season_number}`}
                  className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.75] transition-all"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#111611]">
                  <span className={`font-display text-2xl ${isActive ? 'text-[#F4B942]' : 'text-[#5e5952]'}`}>
                    S{season.season_number}
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-baseline justify-between">
                <span className={`text-xs font-bold ${isActive ? 'text-[#F4B942]' : 'text-[#f3ede2]'}`}>
                  Season {season.season_number}
                </span>
                {season.episode_count > 0 && (
                  <span className="text-[10px] text-[#9e988f]">
                    {season.episode_count} eps
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}