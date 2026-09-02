'use client';

import { Calendar } from 'lucide-react';

export default function SeasonSelector({ seasons, selectedSeason, onSeasonChange }) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5 mb-4">
        <Calendar size={18} className="text-[#F4B942]" />
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f3ede2] tracking-wider uppercase select-none">
          Select Season
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
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
              className={`group relative rounded-xl overflow-hidden aspect-video text-left select-none cursor-pointer transition-all border ${
                isActive
                  ? 'border-[#F4B942] bg-[#162016] ring-2 ring-[#F4B942] shadow-lg shadow-[#F4B942]/15 scale-[1.02]'
                  : 'border-white/[0.14] bg-[#0e120e] hover:border-white/30 hover:bg-[#141a14]'
              }`}
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`Season ${season.season_number}`}
                  className="w-full h-full object-cover brightness-[0.55] group-hover:brightness-[0.75] transition-all"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#111611]">
                  <span className={`font-display text-2xl ${isActive ? 'text-[#F4B942]' : 'text-[#A3A3A3]'}`}>
                    S{season.season_number}
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-baseline justify-between">
                <span className={`text-xs font-bold ${isActive ? 'text-[#F4B942]' : 'text-[#f3ede2]'}`}>
                  Season {season.season_number}
                </span>
                {season.episode_count > 0 && (
                  <span className="text-[11px] font-semibold text-[#E0E0E0]">
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