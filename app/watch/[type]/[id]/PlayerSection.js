"use client";

import { useState, useEffect } from "react";
import { Play, X, Clock, EyeOff, Server, Film } from "lucide-react";

function getEmbedUrl(server, type, id, season, episode) {
  const isTv = type === "tv";

  switch (server) {
    case "Server 1":
      if (isTv) {
        return `https://thisiscinema.pages.dev/?type=tv&version=v3&id=${id}&season=${season}&episode=${episode}&color=22c55e`;
      } else {
        return `https://thisiscinema.pages.dev/?type=movie&version=v3&id=${id}&color=22c55e`;
      }

    case "Server 2":
      return isTv
        ? `https://primesrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}&fallback=false`
        : `https://primesrc.me/embed/movie?tmdb=${id}&fallback=false`;

    case "Server 3":
      return isTv
        ? `https://vidrock.ru/tv/${id}/${season}/${episode}`
        : `https://vidrock.ru/movie/${id}`;

    case "Server 4":
      if (isTv) {
        return `https://vidfast.vc/tv/${id}/${season}/${episode}?theme=22c55e&nextButton=true&autoNext=true`;
      } else {
        return `https://vidfast.vc/movie/${id}?theme=22c55e`;
      }

    default:
      return "";
  }
}

const SERVER_NAMES = ["Server 1", "Server 2", "Server 3", "Server 4"];

export default function PlayerSection({
  type,
  id,
  seasonsData = [],
  isReleased = true,
  selectedSeason = 1,
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  const [season, setSeason] = useState(selectedSeason || 1);
  const [episode, setEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState(SERVER_NAMES[0]);
  const [episodesList, setEpisodesList] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    if (type !== "tv" || typeof window === "undefined") return;

    try {
      const savedProgress = localStorage.getItem(`watch-progress-${id}`);
      if (savedProgress) {
        const { season: savedSeason, episode: savedEpisode } =
          JSON.parse(savedProgress);
        queueMicrotask(() => {
          if (savedSeason) setSeason(savedSeason);
          if (savedEpisode) setEpisode(savedEpisode);
        });
      }
    } catch (error) {
      console.error("Failed to load saved progress from localStorage:", error);
    }
  }, [id, type]);

  useEffect(() => {
    if (type !== "tv" || typeof window === "undefined") return;

    try {
      const progress = { season, episode };
      localStorage.setItem(`watch-progress-${id}`, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  }, [season, episode, id, type]);

  const [prevSelectedSeason, setPrevSelectedSeason] = useState(selectedSeason);
  if (selectedSeason && selectedSeason !== prevSelectedSeason) {
    setPrevSelectedSeason(selectedSeason);
    setSeason(selectedSeason);
    setEpisode(1);
    setEpisodesList([]);
  }

  useEffect(() => {
    if (type !== "tv" || !showPlayer || !isReleased) return;

    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setLoadingEpisodes(true);
    });

    fetch(`/api/episodes?showId=${id}&season=${season}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (isMounted) setEpisodesList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setEpisodesList([]);
      })
      .finally(() => {
        if (isMounted) setLoadingEpisodes(false);
      });

    return () => {
      isMounted = false;
    };
  }, [season, id, type, showPlayer, isReleased]);

  useEffect(() => {
    document.body.style.overflow = showPlayer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPlayer]);

  useEffect(() => {
    if (!showPlayer) return;
    const handler = (e) => {
      if (e.key === "Escape") setShowPlayer(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showPlayer]);

  if (!isReleased) {
    return (
      <div className="inline-flex items-center gap-2 rounded bg-white/[0.05] border border-white/[0.08] px-4 py-2.5 text-xs font-semibold text-[#9e988f]">
        <Clock size={16} className="text-amber-400" />
        Coming Soon
      </div>
    );
  }

  const currentEmbedUrl = getEmbedUrl(activeServer, type, id, season, episode);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          id="watch-now-btn"
          onClick={() => setShowPlayer(true)}
          className="btn-cinema-primary cursor-pointer"
        >
          <Play size={16} fill="currentColor" />
          {type === "tv" && (season > 1 || episode > 1)
            ? `Resume S${season} : E${episode}`
            : "Start Watching"}
        </button>
      </div>

      {showPlayer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/90 fade-in-cinema">
          <div
            onClick={() => setShowPlayer(false)}
            className="absolute inset-0 cursor-pointer"
          />

          <div className="relative flex max-h-[96vh] w-full max-w-[1150px] flex-col overflow-hidden rounded-lg border border-white/[0.1] bg-[#0a0d0a] shadow-2xl z-10">
            {/* Player Top Navigation & Server Switcher */}
            <div className="flex flex-wrap items-center justify-between bg-[#0e120e] px-4 py-2.5 border-b border-white/[0.08] gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#9e988f] mr-1">
                  <Server size={12} /> Server:
                </span>
                {SERVER_NAMES.map((name) => {
                  const isActive = activeServer === name;
                  return (
                    <button
                      key={name}
                      id={`server-${name.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setActiveServer(name)}
                      className={`cursor-pointer rounded px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                        isActive
                          ? "bg-[#F4B942] text-black"
                          : "bg-white/[0.05] text-[#9e988f] hover:bg-white/[0.1] hover:text-white"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              <button
                id="close-player-btn"
                onClick={() => setShowPlayer(false)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded bg-white/[0.05] text-[#9e988f] hover:bg-white/[0.1] hover:text-white transition-colors"
                aria-label="Close video player"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black flex-shrink-0">
              <iframe
                key={`${activeServer}-${season}-${episode}`}
                src={currentEmbedUrl}
                className="absolute inset-0 h-full w-full border-none bg-black"
                allowFullScreen
                allow="autoplay; encrypted-media"
                scrolling="no"
              />
            </div>

            {type === "tv" && (
              <div className="w-full bg-[#080b08] p-3 sm:p-4 border-t border-white/[0.08] flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm tracking-wider uppercase text-[#9e988f]">
                    Season {season} Episodes
                  </span>

                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
                  {loadingEpisodes ? (
                    <div className="flex gap-2.5 w-full">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="skeleton-shimmer h-[100px] w-[180px] rounded flex-shrink-0"
                        />
                      ))}
                    </div>
                  ) : episodesList.length === 0 ? (
                    <p className="py-6 text-center w-full text-xs text-[#5e5952]">
                      No episodes found for Season {season}.
                    </p>
                  ) : (
                    episodesList.map((ep) => {
                      const isActive = ep.episode_number === episode;
                      const isSpoiler = ep.episode_number > episode;

                      return (
                        <button
                          key={ep.episode_number}
                          id={`episode-${ep.episode_number}`}
                          onClick={() => setEpisode(ep.episode_number)}
                          className={`group flex w-[180px] sm:w-[200px] flex-shrink-0 flex-col rounded overflow-hidden text-left transition-all border cursor-pointer ${
                            isActive
                              ? "border-[#F4B942] bg-[#141e14]"
                              : "border-white/[0.08] bg-[#0e120e] hover:border-white/20 hover:bg-[#141a14]"
                          }`}
                        >
                          <div className="relative h-[95px] w-full flex-shrink-0 overflow-hidden bg-[#111611]">
                            {ep.still_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${ep.still_path}`}
                                alt={ep.name}
                                className={`h-full w-full object-cover brightness-[0.8] transition-all ${
                                  isSpoiler
                                    ? "blur-sm group-hover:blur-none scale-105"
                                    : ""
                                }`}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-[#5e5952]">
                                <Film size={18} />
                              </div>
                            )}

                            <div
                              className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                isActive
                                  ? "bg-[#F4B942] text-black"
                                  : "bg-black/80 text-[#f3ede2] border border-white/[0.1]"
                              }`}
                            >
                              EP {ep.episode_number}
                            </div>

                            {isSpoiler && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:opacity-0 transition-opacity">
                                <EyeOff size={14} className="text-[#9e988f]" />
                              </div>
                            )}
                          </div>

                          <div className="p-2 flex-1 flex flex-col justify-between">
                            <div>
                              <p
                                className={`line-clamp-1 text-xs font-semibold ${
                                  isActive
                                    ? "text-[#F4B942]"
                                    : "text-[#f3ede2] group-hover:text-white"
                                }`}
                              >
                                {ep.name || `Episode ${ep.episode_number}`}
                              </p>
                              {ep.overview && (
                                <p className="line-clamp-2 mt-0.5 text-[10px] text-[#9e988f]">
                                  {ep.overview}
                                </p>
                              )}
                            </div>
                            {ep.runtime && (
                              <p className="mt-1 text-[9px] text-[#5e5952]">
                                {ep.runtime} min
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
