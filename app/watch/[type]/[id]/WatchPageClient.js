'use client';

import { useState } from 'react';
import PlayerSection from "./PlayerSection";
import SeasonSelector from "../../../components/SeasonSelector";
import MovieCard from "../../../components/MovieCard";
import { Info, Calendar, Users, Image as ImageIcon, Sparkles } from "lucide-react";

export default function WatchPageClient({
  type,
  id,
  validSeasons,
  isReleased,
  cast = [],
  backdrops = [],
  recommendations = [],
  itemData,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState(() =>
    validSeasons?.length > 0 ? validSeasons[0].season_number : 1
  );

  const tabs = [
    ...(type === 'tv' && validSeasons?.length > 0
      ? [{ id: 'seasons', label: 'Seasons & Episodes', icon: Calendar }]
      : []),
    ...(cast.length > 0
      ? [{ id: 'cast', label: 'Cast & Characters', icon: Users }]
      : []),
    ...(backdrops.length > 0
      ? [{ id: 'gallery', label: 'Gallery', icon: ImageIcon }]
      : []),
    ...(recommendations.length > 0
      ? [{ id: 'similar', label: 'More Like This', icon: Sparkles }]
      : []),
  ];

  return (
    <div className="w-full">
      <PlayerSection
        type={type}
        id={id}
        seasonsData={validSeasons}
        isReleased={isReleased}
        selectedSeason={selectedSeason}
        itemData={itemData}
      />

      <div className="mt-10 sm:mt-14 w-full">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.14] pb-px [scrollbar-width:thin]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B942] ${
                  isActive
                    ? 'border-[#F4B942] text-[#F4B942] bg-white/[0.04] rounded-t-lg'
                    : 'border-transparent text-[#E0E0E0] hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {Icon && <Icon size={16} strokeWidth={2.2} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="py-6 sm:py-8">


          {activeTab === 'seasons' && type === 'tv' && validSeasons?.length > 0 && (
            <SeasonSelector
              seasons={validSeasons}
              selectedSeason={selectedSeason}
              onSeasonChange={setSelectedSeason}
            />
          )}

          {activeTab === 'cast' && cast.length > 0 && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex flex-col items-center text-center bg-[#0e120e] p-4 rounded-xl border border-white/[0.12]"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-full overflow-hidden bg-[#141a14] border-2 border-white/[0.14] shadow-lg">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A3A3A3]">
                          <Users size={24} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#f3ede2] line-clamp-1">
                      {actor.name}
                    </p>
                    <p className="text-xs text-[#E0E0E0] mt-0.5 line-clamp-1">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && backdrops.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {backdrops.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-video w-full rounded-xl overflow-hidden bg-[#141a14] border border-white/[0.14] shadow-lg"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'similar' && recommendations.length > 0 && (
            <div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
                {recommendations.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    type={type}
                    fixedWidth={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}