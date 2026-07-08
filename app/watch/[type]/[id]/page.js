import Header from "../../../components/header";
import PlayerSection from "./PlayerSection";

async function getMediaData(type, id) {
    const url = `https://api.themoviedb.org/3/${type}/${id}?append_to_response=credits,images,watch/providers&language=en-US`;

    const res = await fetch(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
        next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function WatchPage({ params }) {
    const { type, id } = await params;
    const data = await getMediaData(type, id);

    if (!data) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center font-sans text-muted">
                    Title metadata could not be fetched.
                </div>
            </div>
        );
    }

    // 1. Determine release status lifecycle (handles both Movies and TV Shows seamlessly)
    const isReleased = data.status === "Released" || data.status === "Returning Series" || data.status === "Ended";

    // 2. Set up data parsing constants
    const title = data.title || data.name;
    const overview = data.overview || "No synopsis available.";
    const rating = data.vote_average ? data.vote_average.toFixed(1) : "0.0";
    const cast = data.credits?.cast?.slice(0, 5) || [];
    const backdrops = data.images?.backdrops?.slice(0, 4) || [];
    const providers = data["watch/providers"]?.results?.US?.flatrate || [];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
            <Header />

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-12">

                {/* Top Split Profile Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    <div className="md:col-span-4 max-w-xs mx-auto md:mx-0 w-full">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                            alt={title}
                            className="rounded-2xl shadow-2xl border border-muted/10 object-cover w-full aspect-[2/3]"
                        />
                    </div>

                    <div className="md:col-span-8 space-y-6 w-full">
                        <div>
                            <span className="text-primary text-xs font-bold tracking-widest uppercase block mb-1">
                                {type === "tv" ? "TV Series" : "Feature Film"}
                            </span>
                            <h1 className="font-display text-4xl md:text-6xl tracking-wide uppercase leading-none">
                                {title}
                            </h1>

                            {/* 3. The cleaned up metadata details section */}
                            <div className="flex items-center gap-4 text-sm text-muted mt-3">
                                <span className="text-accent font-bold">★ {rating} Rating</span>
                                <span>•</span>
                                <span>{data.release_date || data.first_air_date || "N/A"}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Synopsis</h3>
                            <p className="text-foreground/90 leading-relaxed max-w-2xl text-sm md:text-base">
                                {overview}
                            </p>
                        </div>

                        {/* Player / Coming Soon Dynamic Controller Action */}
                        <PlayerSection
                            type={type}
                            id={id}
                            seasonsData={data.seasons || []}
                            isReleased={isReleased}
                        />

                        {/* Available Platforms Section */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Available Platforms (US)</h3>
                            {providers.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {providers.map((p) => (
                                        <div key={p.provider_id} className="flex items-center gap-2 bg-panel border border-muted/10 rounded-xl px-3 py-2 text-xs font-medium">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                alt={p.provider_name}
                                                className="w-6 h-6 rounded-md shadow-sm"
                                            />
                                            {p.provider_name}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted">Available via digital storefront purchases or physical rentals only.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Principal Cast Section */}
                <section className="space-y-4">
                    <h2 className="font-display text-2xl tracking-wide uppercase border-b border-muted/10 pb-2">
                        Principal Cast
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {cast.map((actor) => (
                            <div key={actor.id} className="bg-panel border border-muted/10 rounded-xl p-3 flex items-center gap-3">
                                {actor.profile_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                        alt={actor.name}
                                        className="w-10 h-10 rounded-full object-cover border border-muted/20 shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-background border border-muted/20 shrink-0 flex items-center justify-center text-[10px] text-muted font-bold">
                                        N/A
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-foreground truncate">{actor.name}</div>
                                    <div className="text-[11px] text-muted truncate">{actor.character}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Movie Backdrop Image Gallery Section */}
                {backdrops.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="font-display text-2xl tracking-wide uppercase border-b border-muted/10 pb-2">
                            Media Gallery
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {backdrops.map((img, index) => (
                                <div key={index} className="aspect-video rounded-xl overflow-hidden border border-muted/10 bg-panel shadow-sm">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                                        alt="Backdrop gallery snapshot"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}