'use client';

import { useState, useEffect, useMemo } from "react";
import { Play, X, Clock, EyeOff } from "lucide-react";

function getEmbedUrl(server, type, id, season, episode) {
  const isTv = type === "tv";

  switch (server) {
    case "Server 1":
      if (isTv) {
        return `https://thisiscinema.pages.dev/?type=tv&version=v3&id=${id}&season=${season}&episode=${episode}&color=2d9b4e`;
      } else {
        return `https://thisiscinema.pages.dev/?type=movie&version=v3&id=${id}&color=2d9b4e`;
      }

    case "Server 2":
      return isTv
        ? `https://vidsuper.net/tv/${id}/${season}/${episode}?color=2d9b4e`
        : `https://vidsuper.net/movie/${id}?color=2d9b4e`;

    case "Server 3":
      return isTv
        ? `https://vidrock.ru/tv/${id}/${season}/${episode}`
        : `https://vidrock.ru/movie/${id}`;

    case "Server 4":
      if (isTv) {
        return `https://vidfast.vc/tv/${id}/${season}/${episode}?theme=2d9b4e&nextButton=true&autoNext=true`;
      } else {
        return `https://vidfast.vc/movie/${id}?theme=2d9b4e`;
      }

    default:
      return "";
  }
}

const SERVER_NAMES = ["Server 1", "Server 2", "Server 3", "Server 4"];

export default function PlayerSection({ type, id, seasonsData = [], isReleased = true, selectedSeason = 1 }) {
  const [showPlayer, setShowPlayer] = useState(false);

  // Memoize filtered seasons array
  const validSeasons = useMemo(() => seasonsData.filter((s) => s.season_number > 0), [seasonsData]);

  const [season, setSeason] = useState(selectedSeason || (validSeasons.length > 0 ? validSeasons[0].season_number : 1));
  const [episode, setEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState(SERVER_NAMES[0]);
  const [episodesList, setEpisodesList] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // RESTORE PROGRESS FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    if (type !== "tv" || typeof window === "undefined") return;

    try {
      const savedProgress = localStorage.getItem(`watch-progress-${id}`);
      if (savedProgress) {
        const { season: savedSeason, episode: savedEpisode } = JSON.parse(savedProgress);
        if (savedSeason) setSeason(savedSeason);
        if (savedEpisode) setEpisode(savedEpisode);
      }
    } catch (error) {
      console.error("Failed to load saved progress from localStorage:", error);
    }
  }, [id, type]);

  // SAVE PROGRESS TO LOCALSTORAGE WHEN EPISODE/SEASON CHANGES
  useEffect(() => {
    if (type !== "tv" || typeof window === "undefined") return;

    try {
      const progress = { season, episode };
      localStorage.setItem(`watch-progress-${id}`, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  }, [season, episode, id, type]);

  // Sync external parent season selection changes smoothly
  useEffect(() => {
    if (selectedSeason && selectedSeason !== season) {
      setSeason(selectedSeason);
      setEpisode(1);
      setEpisodesList([]);
    }
  }, [selectedSeason]);

  // Handle data fetching for TV Episodes safely
  useEffect(() => {
    if (type !== "tv" || !showPlayer || !isReleased) return;

    let isMounted = true;
    setLoadingEpisodes(true);

    fetch(`/api/episodes?showId=${id}&season=${season}`)
      .then((r) => r.ok ? r.json() : [])
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
    return () => { document.body.style.overflow = ""; };
  }, [showPlayer]);

  useEffect(() => {
    if (!showPlayer) return;
    const handler = (e) => { if (e.key === "Escape") setShowPlayer(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showPlayer]);

  if (!isReleased) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/5 bg-emerald-500/[0.04] px-5 py-3 text-xs font-medium text-[rgba(232,221,208,0.4)] tracking-wider">
        <Clock size={16} className="opacity-50" />
        Coming soon
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
          className="hero-btn min-w-35 px-7 py-3 text-xs cursor-pointer"
        >
          <Play size={18} />
          {type === "tv" && (season > 1 || episode > 1) ? `Resume S${season}: E${episode}` : "Start watching"}
        </button>
      </div>

      {showPlayer && (
        <div className="overlay-enter fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => setShowPlayer(false)}
            className="absolute inset-0 cursor-pointer bg-[#060c06]/92 backdrop-blur-xl"
          />

          <div className="panel-enter relative flex max-h-[100vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-xl border border-emerald-500/5 bg-gradient-to-br from-[#0e180e] to-[#0a120a] shadow-[0_48px_128px_rgba(0,0,0,0.9),0_0_0_1px_rgba(45,155,78,0.04)] z-10">

            {/* TOP HEADER MENU */}
            <div className="flex flex-shrink-0 items-center justify-between bg-[#0a0f0a]/50 px-3 py-2 border-b border-emerald-500/5">
              <div className="flex gap-1">
                {SERVER_NAMES.map((name) => {
                  const isActive = activeServer === name;
                  return (
                    <button
                      key={name}
                      id={`server-${name.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setActiveServer(name)}
                      className={`cursor-pointer rounded px-3 py-1 text-[10px] font-semibold uppercase tracking-widest font-sans transition-all duration-200 border ${isActive
                        ? "border-emerald-500/20 bg-emerald-500/5 text-[#2d9b4e]"
                        : "border-emerald-500/5 bg-emerald-500/[0.02] text-[rgba(232,221,208,0.3)]"
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
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded border border-emerald-500/5 bg-emerald-500/[0.02] text-[rgba(232,221,208,0.3)] transition-all duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* MAIN CONTENT WORKSPACE AREA */}
            <div className="flex flex-1 flex-col min-h-0 overflow-y-auto [scrollbar-width:thin]">

              {/* VIDEO ASPECT FRAME CONTAINER */}
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

              {/* HORIZONTAL EPISODE SLIDER SLOT (TV SHOWS ONLY) */}
              {type === "tv" && (
                <div className="w-full bg-[#050905]/60 p-4 border-t border-emerald-500/5">

                  {/* SEASON PILLS BAR */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-3 [scrollbar-width:none] border-b border-emerald-500/[0.03]">
                    {validSeasons.slice(0, 12).map((s) => {
                      const isCurrentSeason = season === s.season_number;
                      return (
                        <button
                          key={s.season_number}
                          onClick={() => {
                            setSeason(s.season_number);
                            setEpisode(1);
                            setEpisodesList([]);
                          }}
                          className={`cursor-pointer rounded px-3 py-1 text-[10px] font-bold font-sans transition-all duration-150 border flex-shrink-0 ${isCurrentSeason
                            ? "border-emerald-500/20 bg-emerald-500/5 text-[#2d9b4e]"
                            : "border-emerald-500/5 bg-emerald-500/[0.02] text-[rgba(232,221,208,0.3)] hover:text-[rgba(232,221,208,0.6)]"
                            }`}
                        >
                          Season {s.season_number}
                        </button>
                      );
                    })}
                  </div>

                  {/* EPISODES HORIZONTAL TRACK GRID */}
                  <div className="flex gap-3 overflow-x-auto pt-3 pb-1 [scrollbar-width:thin]">
                    {loadingEpisodes ? (
                      <div className="flex gap-3 w-full">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="skeleton h-[110px] w-[180px] rounded flex-shrink-0" />
                        ))}
                      </div>
                    ) : episodesList.length === 0 ? (
                      <p className="py-8 text-center w-full text-xs italic text-[rgba(232,221,208,0.2)]">
                        No episodes listed.
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
                            className={`group flex w-[190px] flex-shrink-0 flex-col rounded overflow-hidden text-left transition-all duration-150 border cursor-pointer ${isActive
                              ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                              : "border-emerald-500/5 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03]"
                              }`}
                          >
                            {/* IMAGE EMBED BLOCK */}
                            <div className="relative h-[100px] w-full flex-shrink-0 overflow-hidden bg-[#111811] border-b border-emerald-500/5">
                              {ep.still_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w185${ep.still_path}`}
                                  alt={ep.name}
                                  className={`h-full w-full object-cover brightness-[0.85] transition-all duration-300 ${isSpoiler ? "blur-md scale-105 group-hover:blur-sm" : ""}`}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-[rgba(232,221,208,0.15)] bg-[#0c120c]">
                                  No Thumbnail
                                </div>
                              )}

                              {/* VISIBLE ABSOLUTE EPISODE COUNTER BADGE */}
                              <div className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-black tracking-wider shadow-md backdrop-blur-md border ${isActive
                                ? "bg-emerald-950/80 border-emerald-500/30 text-[#2d9b4e]"
                                : "bg-black/60 border-white/5 text-[rgba(232,221,208,0.7)]"
                                }`}>
                                EP {ep.episode_number}
                              </div>

                              {isSpoiler && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                                  <EyeOff size={14} className="text-[rgba(232,221,208,0.4)] group-hover:opacity-0 transition-opacity duration-200" />
                                </div>
                              )}
                            </div>

                            {/* DESCRIPTION AND LABEL LABELS */}
                            <div className={`p-2 flex-1 flex flex-col justify-between transition-all duration-300 ${isSpoiler ? "blur-[3px] group-hover:blur-0 select-none opacity-40 group-hover:opacity-80" : ""}`}>
                              <div>
                                <p className={`line-clamp-1 text-[11px] font-bold tracking-wide ${isActive ? "text-[#2d9b4e]" : "text-[rgba(232,221,208,0.75)]"}`}>
                                  {ep.name}
                                </p>
                                {ep.overview && (
                                  <p className="line-clamp-2 mt-1 text-[10px] leading-snug text-[rgba(232,221,208,0.25)]">
                                    {ep.overview}
                                  </p>
                                )}
                              </div>
                              {ep.runtime && (
                                <p className="mt-1.5 text-[9px] font-medium tracking-widest text-[rgba(232,221,208,0.2)]">
                                  {ep.runtime} MINS
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
        </div>
      )}
    </>
  );
}