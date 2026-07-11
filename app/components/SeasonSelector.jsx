'use client';

import { Calendar } from 'lucide-react';

export default function SeasonSelector({ seasons, selectedSeason, onSeasonChange }) {
    return (
        <div>
            {/* Title */}
            <h3 className="font-sans text-[12px] font-semibold text-[#e8ddd0]/40 tracking-wider uppercase mb-3 select-none">
                Seasons
            </h3>

            {/* Grid Container */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                {seasons.map((season) => {
                    const posterUrl = season.poster_path
                        ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
                        : null;
                    const isActive = selectedSeason === season.season_number;

                    return (
                        <div
                            key={season.season_number}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isActive) {
                                    onSeasonChange(season.season_number);
                                }
                            }}
                            style={{
                                WebkitTapHighlightColor: 'transparent',
                                WebkitUserSelect: 'none',
                                touchAction: 'manipulation'
                            }}
                            className={`group relative rounded-lg overflow-hidden aspect-video bg-[#111811] text-left select-none cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] ${isActive
                                    ? 'ring-2 ring-[#2d9b4e] ring-offset-2 ring-offset-[#0a0f0a]'
                                    : 'ring-1 ring-white/[0.04]'
                                }`}
                        >
                            {/* Thumbnail Image */}
                            {posterUrl ? (
                                <img
                                    src={posterUrl}
                                    alt={`Season ${season.season_number}`}
                                    className="w-full h-full object-cover block brightness-[0.75] pointer-events-none"
                                />
                            ) : (
                                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${isActive ? 'bg-[#2d9b4e]/10' : 'bg-[#111811]'
                                    }`}>
                                    <Calendar
                                        size={24}
                                        className={isActive ? 'text-[#2d9b4e]' : 'text-[#e8ddd0]/10'}
                                    />
                                    <span className={`text-xl font-bold ${isActive ? 'text-[#2d9b4e]' : 'text-[#e8ddd0]/10'
                                        }`}>
                                        S{season.season_number}
                                    </span>
                                </div>
                            )}

                            {/* Refined Active Green Overlay */}
                            {isActive && (
                                <div className="absolute inset-0 bg-[#2d9b4e]/15 mix-blend-color pointer-events-none z-10" />
                            )}

                            {/* Bottom Metadata Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-baseline justify-between z-20 pointer-events-none">
                                <span className={`font-sans text-[14px] font-bold tracking-wide ${isActive ? 'text-[#2d9b4e]' : 'text-[#e8ddd0]'
                                    }`}>
                                    S{season.season_number}
                                </span>
                                {season.episode_count > 0 && (
                                    <span className={`font-sans text-[11px] tracking-wide ${isActive ? 'text-[#2d9b4e]/70' : 'text-[#e8ddd0]/40'
                                        }`}>
                                        {season.episode_count} eps
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}