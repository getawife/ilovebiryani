import React from 'react';

export default function VideoPlayer({ id = "299534", type = "movie", season, episode }) {

    const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const playerColor = isDarkMode ? "3B82F6" : "0052FF";

    const baseUrl = type === "tv"
        ? `https://vidsuper.net/tv/${id}/${season || 1}/${episode || 1}`
        : `https://vidsuper.net/movie/${id}`;

    const playerSrc = `${baseUrl}?color=${playerColor}&autoplay=false&nextEpisode=true&episodeSelector=true&overlay=true&skip_intro=true`;

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
            <div className="relative w-full rounded-2xl overflow-hidden bg-panel shadow-2xl border border-muted/10 aspect-video">
                <iframe
                    src={playerSrc}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="encrypted-media"
                />
            </div>
        </div>
    );
}