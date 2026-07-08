"use client";

import { useState, useEffect } from "react";

export default function PlayerSection({ type, id, seasonsData = [], isReleased = true }) {
    const [showPlayer, setShowPlayer] = useState(false);
    const [activeServer, setActiveServer] = useState("vidsrc");

    const validSeasons = seasonsData.filter((s) => s.season_number > 0);

    const [season, setSeason] = useState(validSeasons.length > 0 ? validSeasons[0].season_number : 1);
    const [episode, setEpisode] = useState(1);
    const [episodesList, setEpisodesList] = useState([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    const servers = {
        vidsrc: type === "tv"
            ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
            : `https://vidsrc.to/embed/movie/${id}`,
        vidsuper: type === "tv"
            ? `https://vidsuper.net/embed/tv/${id}/${season}/${episode}`
            : `https://vidsuper.net/embed/movie/${id}`,
        vidapi: type === "tv"
            ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
            : `https://vidsrc.xyz/embed/movie?tmdb=${id}`
    };

    useEffect(() => {
        if (type !== "tv" || !showPlayer || !isReleased) return;

        async function fetchEpisodes() {
            setLoadingEpisodes(true);
            try {
                const res = await fetch(`/api/episodes?showId=${id}&season=${season}`);
                if (res.ok) {
                    const data = await res.json();
                    setEpisodesList(data);
                }
            } catch (err) {
                console.error("Failed fetching overlay episodes:", err);
            } finally {
                setLoadingEpisodes(false);
            }
        }
        fetchEpisodes();
    }, [season, id, type, showPlayer, isReleased]);

    useEffect(() => {
        document.body.style.overflow = showPlayer ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [showPlayer]);

    // If the media is unreleased, display the Coming Soon layout state
    if (!isReleased) {
        return (
            <div className="pt-2">
                <div className="inline-flex items-center gap-3 bg-panel border border-muted/10 text-muted font-semibold text-sm px-6 py-3.5 rounded-xl select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Coming Soon
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Stream Action Deck */}
            <div className="flex flex-wrap gap-4 pt-2">
                <button
                    onClick={() => setShowPlayer(true)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-foreground font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Now
                </button>

                <button className="flex items-center justify-center gap-2 bg-panel hover:bg-muted/10 text-foreground border border-muted/20 font-semibold text-sm px-6 py-3 rounded-xl transition-all active:scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download
                </button>
            </div>

            {/* Media Overlay Stage Lightbox */}
            {showPlayer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div onClick={() => setShowPlayer(false)} className="absolute inset-0 bg-background/90 backdrop-blur-sm cursor-pointer" />

                    <div className="relative w-full max-w-[95%] md:max-w-[70%] bg-panel rounded-2xl overflow-hidden shadow-2xl border border-muted/20 z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">

                        {/* --- TOP BAR: Moved Close Button Here --- */}
                        <div className="flex items-center justify-between p-3 border-b border-muted/10">
                            <button
                                onClick={() => setShowPlayer(false)}
                                className="p-2 hover:bg-muted/10 rounded-lg text-foreground transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Embed Port Frame Canvas */}
                        <div className="relative w-full aspect-video bg-black">

                            {/* --- TOP-LEFT: Server Controller --- */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                {Object.keys(servers).map((serverName) => (
                                    <button
                                        key={serverName}
                                        onClick={() => setActiveServer(serverName)}
                                        className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-all uppercase cursor-pointer backdrop-blur shadow-md ${activeServer === serverName
                                            ? "bg-primary text-white border border-primary"
                                            : "bg-black/60 text-muted hover:text-foreground border border-muted/10"
                                            }`}
                                    >
                                        {serverName}
                                    </button>
                                ))}
                            </div>

                            <iframe src={servers[activeServer]} className="w-full h-full" allowFullScreen scrolling="no" frameBorder="0" allow="autoplay; encrypted-media" />
                        </div>

                        {/* (Keep your existing Season/Episode bar below the video if needed) */}
                        {type === "tv" && (
                            <div className="bg-panel p-3 border-t border-muted/10 flex items-center gap-4">
                                {/* ... your existing season/episode selectors ... */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}