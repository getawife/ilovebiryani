'use client';

import { useState, useEffect, useMemo } from "react";
import { Play, X, Clock, Film, EyeOff } from "lucide-react";

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
  const [showEpisodes, setShowEpisodes] = useState(false);

  // Memoize filtered seasons array to prevent repetitive array filtering cycles on render
  const validSeasons = useMemo(() => seasonsData.filter((s) => s.season_number > 0), [seasonsData]);

  const [season, setSeason] = useState(() => selectedSeason || (validSeasons.length > 0 ? validSeasons[0].season_number : 1));
  const [episode, setEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState(SERVER_NAMES[0]);
  const [episodesList, setEpisodesList] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Sync external parent season selection changes smoothly
  useEffect(() => {
    if (selectedSeason && selectedSeason !== season) {
      setSeason(selectedSeason);
      setEpisode(1);
      setEpisodesList([]);
    }
  }, [selectedSeason]);

  // Handle data fetching for TV Episodes safely with cleanup logic to handle component unmount/race conditions
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

  const activeEpisodeData = episodesList.find((e) => e.episode_number === episode);
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
          Start watching
        </button>
      </div>

      {showPlayer && (
        <div className="overlay-enter fixed inset-0 z-[200] flex items-center justify-center">
          <div
            onClick={() => setShowPlayer(false)}
            className="absolute inset-0 cursor-pointer bg-[#060c06]/92 backdrop-blur-xl"
          />

          <div className="panel-enter relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-[min(1100px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-emerald-500/5 bg-gradient-to-br from-[#0e180e] to-[#0a120a] shadow-[0_48px_128px_rgba(0,0,0,0.9),0_0_0_1px_rgba(45,155,78,0.04)] z-10">

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

              <div className="flex items-center gap-1">
                {type === "tv" && (
                  <button
                    onClick={() => setShowEpisodes((v) => !v)}
                    id="toggle-episodes-btn"
                    className={`flex cursor-pointer items-center gap-1 rounded border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest font-sans transition-all duration-200 ${showEpisodes
                      ? "border-emerald-500/5 bg-emerald-500/5 text-[rgba(232,221,208,0.6)]"
                      : "border-emerald-500/5 bg-emerald-500/[0.02] text-[rgba(232,221,208,0.25)]"
                      }`}
                  >
                    <Film size={12} />
                    Episodes
                  </button>
                )}
                <button
                  id="close-player-btn"
                  onClick={() => setShowPlayer(false)}
                  className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded border border-emerald-500/5 bg-emerald-500/[0.02] text-[rgba(232,221,208,0.3)] transition-all duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500/60"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Added relative layout context here so child sidebar can calculate dimensions seamlessly */}
            <div className="relative flex flex-1 min-h-0 overflow-hidden bg-black">
              <div className="relative flex-1 min-w-0 aspect-video bg-black">
                <iframe
                  key={`${activeServer}-${season}-${episode}`}
                  src={currentEmbedUrl}
                  className="absolute inset-0 h-full w-full border-none bg-black"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  scrolling="no"
                />
              </div>

              {type === "tv" && showEpisodes && (
                /* Switched container to absolute right placement so it locks overlay without reshaping the layout window */
                <div className="absolute right-0 top-0 bottom-0 z-20 flex w-[clamp(220px,32vw,280px)] flex-shrink-0 flex-col overflow-hidden bg-[#060c06]/94 border-l border-emerald-500/10 backdrop-blur-md shadow-2xl animate-fade-in">
                  <div className="flex flex-wrap gap-1 bg-[#0a0f0a]/80 px-2.5 py-2 border-b border-emerald-500/5">
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
                          className={`cursor-pointer rounded px-2 py-0.5 text-[10px] font-semibold font-sans transition-all duration-150 border ${isCurrentSeason
                            ? "border-emerald-500/20 bg-emerald-500/5 text-[#2d9b4e]"
                            : "border-emerald-500/5 bg-emerald-500/[0.02] text-[rgba(232,221,208,0.25)]"
                            }`}
                        >
                          S{s.season_number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex-1 overflow-y-auto p-1.5 [scrollbar-width:thin]">
                    {loadingEpisodes ? (
                      <div className="flex flex-col gap-1.5 p-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="skeleton h-12 rounded" />
                        ))}
                      </div>
                    ) : episodesList.length === 0 ? (
                      <p className="p-6 text-center text-[11px] italic text-[rgba(232,221,208,0.2)]">
                        No episodes listed.
                      </p>
                    ) : (
                      episodesList.map((ep) => {
                        const isActive = ep.episode_number === episode;
                        // Spoiler condition: any upcoming episode in the current season list index
                        const isSpoiler = ep.episode_number > episode;

                        return (
                          <button
                            key={ep.episode_number}
                            id={`episode-${ep.episode_number}`}
                            onClick={() => setEpisode(ep.episode_number)}
                            className={`group mb-[6px] flex w-full items-start gap-1.5 rounded p-1.5 text-left transition-all duration-150 border cursor-pointer hover:bg-emerald-500/[0.03] ${isActive
                              ? "border-emerald-500/15 bg-emerald-500/5"
                              : "border-transparent bg-transparent"
                              }`}
                          >
                            <div className="relative h-[34px] w-[60px] flex-shrink-0 overflow-hidden rounded border border-emerald-500/5 bg-[#111811]">
                              {ep.still_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w185${ep.still_path}`}
                                  alt={ep.name}
                                  className={`h-full w-full object-cover brightness-[0.9] transition-all duration-300 ${isSpoiler ? "blur-md scale-105 group-hover:blur-sm" : ""}`}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[8px] text-[rgba(232,221,208,0.15)]">
                                  E{ep.episode_number}
                                </div>
                              )}

                              {isSpoiler && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                                  <EyeOff size={10} className="text-[rgba(232,221,208,0.4)] group-hover:opacity-0 transition-opacity duration-200" />
                                </div>
                              )}
                            </div>

                            <div className={`flex-1 overflow-hidden transition-all duration-300 ${isSpoiler ? "blur-[3.5px] group-hover:blur-0 select-none opacity-40 group-hover:opacity-80" : ""}`}>
                              <p className={`line-clamp-1 text-[11px] font-semibold leading-tight tracking-wide ${isActive ? "text-[#2d9b4e]" : "text-[rgba(232,221,208,0.6)]"}`}>
                                {ep.episode_number}. {ep.name}
                              </p>
                              {ep.runtime && (
                                <p className="mt-px text-[9px] tracking-widest text-[rgba(232,221,208,0.2)]">
                                  {ep.runtime}m
                                </p>
                              )}
                              {ep.overview && (
                                <p className="line-clamp-2 mt-0.5 text-[9px] italic leading-tight text-[rgba(232,221,208,0.2)]">
                                  {ep.overview}
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