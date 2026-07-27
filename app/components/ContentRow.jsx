'use client';

import Link from 'next/link';
import { ArrowRight, Flame, Tv, Trophy, Popcorn } from 'lucide-react';
import MovieCard from './MovieCard';

const iconMap = {
    Flame: Flame,
    Tv: Tv,
    Trophy: Trophy,
    Popcorn: Popcorn,
};

export function ContentRow({ title, iconName, color, items, type }) {
    const Icon = iconMap[iconName];

    return (
        <section style={{ marginTop: "3rem" }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                padding: "0 0.25rem"
            }}>
                {Icon && <Icon size={18} color={color} />}
                <h2 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#e8ddd0",
                    fontWeight: 700
                }}>
                    {title}
                </h2>
                <Link
                    href={`/${type}s`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.65rem",
                        color: "rgba(232,221,208,0.25)",
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        transition: "color 0.2s ease",
                        flexShrink: 0,
                        padding: "0.2rem 0.4rem",
                        borderRadius: 4
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = color}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,221,208,0.25)"}
                >
                    View All
                    <ArrowRight size={12} />
                </Link>
            </div>
            <div className="scroll-row" style={{
                gap: "1rem",
                padding: "0.5rem 0.25rem 1.25rem"
            }}>
                {items.map((item) => (
                    <MovieCard key={item.id} item={item} type={type} accentColor={color ? `${color}E6` : undefined} fixedWidth={true} />
                ))}
            </div>
        </section>
    );
}