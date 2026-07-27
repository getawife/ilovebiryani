'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { getRatingColor } from '../../lib/utils';

export function MovieCard({ item, type, accentColor = '#2d9b4eE6', fixedWidth = true }) {
    if (!item) return null;

    const mediaType = item.media_type || item.type || type || 'movie';
    const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
        : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;

    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || '').split('-')[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : (item.rating || '0.0');

    // Check if it's a continue watching item (has season and episode)
    const isContinueWatching = item.season !== undefined && item.episode !== undefined;

    return (
        <Link
            href={`/watch/${mediaType}/${item.id}`}
            style={{
                display: 'block',
                width: fixedWidth ? 160 : '100%',
                textDecoration: 'none',
                flexShrink: fixedWidth ? 0 : undefined,
            }}
        >
            <div
                className="card-hover"
                style={{
                    background: '#111811',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: `1px solid ${accentColor === '#2d9b4eE6' ? 'rgba(150,200,150,0.06)' : accentColor.slice(0, 7) + '15'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '2/3',
                        overflow: 'hidden',
                        background: '#0a0f0a',
                    }}
                >
                    <img
                        src={poster}
                        alt={title}
                        loading="lazy"
                        className="poster-img"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            filter: 'brightness(0.92) saturate(0.95)',
                        }}
                    />

                    {!isContinueWatching && rating !== '0.0' && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 8,
                                left: 8,
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(6px)',
                                borderRadius: 4,
                                padding: '0.15rem 0.5rem',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                border: '1px solid rgba(255,255,255,0.05)',
                                zIndex: 2,
                            }}
                            className={getRatingColor(rating)}
                        >
                            ★ {rating}
                        </div>
                    )}

                    <div className="play-overlay">
                        <div className="play-btn" style={{ background: accentColor }}>
                            <Play size={18} fill="white" style={{ marginLeft: 2 }} />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        padding: '0.6rem 0.7rem 0.7rem',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    <p
                        style={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            color: '#e8ddd0',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '0.2rem',
                            letterSpacing: '0.02em',
                        }}
                    >
                        {title}
                    </p>
                    <p
                        style={{
                            fontSize: '0.65rem',
                            color: isContinueWatching ? (accentColor.startsWith('#c9a84c') ? '#c9a84c' : '#2d9b4e') : 'rgba(232,221,208,0.3)',
                            fontWeight: isContinueWatching ? '600' : 'normal',
                            letterSpacing: '0.08em',
                        }}
                    >
                        {isContinueWatching
                            ? `Season ${item.season} · Ep ${item.episode}`
                            : (year || 'Coming Soon')}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;
