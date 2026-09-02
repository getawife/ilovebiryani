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
      <div className="inline-flex items-center gap-2 rounded-lg bg-white/[0.08] border border-white/[0.14] px-5 py-3 text-sm font-semibold text-[#E0E0E0]">
        <Clock size={18} className="text-amber-400" />
        Coming Soon
      </div>
    );
  }

  const currentEmbedUrl = getEmbedUrl(activeServer, type, id, season, episode);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <button
          id="watch-now-btn"
          onClick={() => setShowPlayer(true)}
          className="btn-cinema-primary cursor-pointer"
        >
          <Play size={18} fill="currentColor" />
          {type === "tv" && (season > 1 || episode > 1)
            ? `Resume S${season} : E${episode}`
            : "Start Watching"}
        </button>
      </div>

      {showPlayer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 player-backdrop-dim fade-in-cinema">
          <div
            onClick={() => setShowPlayer(false)}
            className="absolute inset-0 cursor-pointer"
            aria-label="Close modal background"
          />

          <div className="relative flex max-h-[96vh] w-full max-w-[1240px] flex-col overflow-hidden rounded-2xl border border-white/[0.16] bg-[#0a0d0a] shadow-2xl z-10">
            <div className="flex flex-wrap items-center justify-between bg-[#0e120e] px-5 py-3 border-b border-white/[0.12] gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E0E0E0] mr-1">
                  <Server size={14} className="text-[#F4B942]" /> Server:
                </span>
                {SERVER_NAMES.map((name) => {
                  const isActive = activeServer === name;
                  return (
                    <button
                      key={name}
                      id={`server-${name.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setActiveServer(name)}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all ${
                        isActive
                          ? "bg-[#F4B942] text-black shadow-sm"
                          : "bg-white/[0.08] text-[#E0E0E0] hover:bg-white/[0.15] hover:text-white"
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
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/[0.08] text-[#E0E0E0] hover:bg-white/[0.18] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                aria-label="Close video player"
              >
                <X size={18} />
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
              <div className="w-full bg-[#080b08] p-4 sm:p-5 border-t border-white/[0.12] flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-base tracking-wider uppercase text-[#f3ede2]">
                    Season {season} Episodes
                  </span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                  {loadingEpisodes ? (
                    <div className="flex gap-3 w-full">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="skeleton-shimmer h-[120px] w-[240px] rounded-xl flex-shrink-0"
                        />
                      ))}
                    </div>
                  ) : episodesList.length === 0 ? (
                    <p className="py-8 text-center w-full text-sm font-semibold text-[#E0E0E0]">
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
                          className={`group flex w-[230px] sm:w-[260px] flex-shrink-0 flex-col rounded-xl overflow-hidden text-left transition-all border cursor-pointer ${
                            isActive
                              ? "border-[#F4B942] bg-[#162016] ring-2 ring-[#F4B942] shadow-lg shadow-[#F4B942]/15"
                              : "border-white/[0.14] bg-[#0e120e] hover:border-white/30 hover:bg-[#141a14]"
                          }`}
                        >
                          <div className="relative h-[115px] w-full flex-shrink-0 overflow-hidden bg-[#111611]">
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
                              <div className="flex h-full w-full items-center justify-center text-xs text-[#A3A3A3]">
                                <Film size={20} />
                              </div>
                            )}

                            <div
                              className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                isActive
                                  ? "bg-[#F4B942] text-black"
                                  : "card-badge-pill"
                              }`}
                            >
                              EP {ep.episode_number}
                            </div>

                            {isSpoiler && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:opacity-0 transition-opacity">
                                <EyeOff size={16} className="text-[#E0E0E0]" />
                              </div>
                            )}
                          </div>

                          <div className="p-3 flex-1 flex flex-col justify-between gap-1.5">
                            <div>
                              <p
                                className={`text-xs font-bold leading-snug ${
                                  isActive
                                    ? "text-[#F4B942]"
                                    : "text-[#f3ede2] group-hover:text-white"
                                }`}
                              >
                                {ep.name || `Episode ${ep.episode_number}`}
                              </p>
                              {ep.overview && (
                                <p className="line-clamp-2 mt-1 text-[11px] leading-relaxed text-[#E0E0E0]">
                                  {ep.overview}
                                </p>
                              )}
                            </div>
                            {ep.runtime && (
                              <p className="mt-1 text-[11px] font-medium text-[#A3A3A3]">
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
