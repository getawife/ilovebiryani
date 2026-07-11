import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from "../../../components/header";
import WatchPageClient from "./WatchPageClient";
import { User, Clock } from 'lucide-react';

async function getMediaData(type, id) {
  const url = `https://api.themoviedb.org/3/${type}/${id}?append_to_response=credits,images,watch/providers,recommendations&language=en-US`;
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

function getRatingColor(r) {
  const n = parseFloat(r);
  if (n >= 7.5) return "text-[#2d9b4e]";
  if (n >= 6) return "text-[#c9a84c]";
  return "text-[#8b5a2b]";
}

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function WatchPage({ params }) {
  const { type, id } = await params;
  const data = await getMediaData(type, id);

  if (!data) {
    notFound();
  }

  const isReleased = ["Released", "Returning Series", "Ended"].includes(data.status);
  const title = data.title || data.name;
  const overview = data.overview || "No synopsis available.";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "0.0";
  const year = (data.release_date || data.first_air_date || "").split("-")[0];
  const genres = data.genres || [];
  const cast = data.credits?.cast?.slice(0, 8) || [];
  const backdrops = data.images?.backdrops?.slice(0, 6) || [];
  const recommendations = data.recommendations?.results?.slice(0, 12) || [];
  const runtime = type === "movie" ? formatRuntime(data.runtime) : null;
  const seasons = type === "tv" ? data.number_of_seasons : null;
  const episodes = type === "tv" ? data.number_of_episodes : null;
  const validSeasons = (data.seasons || []).filter((s) => s.season_number > 0);

  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : null;
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null;

  const logoAsset = data.images?.logos?.find(
    (logo) => logo.iso_639_1 === 'en' || logo.iso_639_1 === null
  );
  const logoUrl = logoAsset ? `https://image.tmdb.org/t/p/w500${logoAsset.file_path}` : null;

  return (
    <div className="isolate flex min-h-screen flex-col bg-[#0a0f0a] text-[#e8ddd0]">
      <Header />

      {/* FIXED BACKDROP LAYER */}
      {backdropUrl && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[-2] h-[65vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="h-full w-full object-cover object-[center_20%] brightness-[0.18] saturate-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0f0a] to-[95%]" />
        </div>
      )}

      {/* AMBIENT GLOW LAYER */}
      {posterUrl && (
        <div
          className="pointer-events-none fixed inset-0 z-[-1] bg-[length:100%_auto] bg-[center_-10%] opacity-12 blur-[140px] saturate-[1.8]"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {/* Hero Header Section */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-[clamp(80px,12vh,150px)]">
        <div className="grid items-end gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-6 grid-cols-1 sm:grid-cols-[minmax(140px,220px)_1fr] sm:text-left text-center justify-items-center sm:justify-items-start">

          {/* Movie Poster Wrapper */}
          <div className="w-[clamp(140px,45vw,180px)] sm:w-full flex-shrink-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="aspect-[2/3] w-full rounded-grow object-cover rounded-lg border border-white/5 shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg border border-white/5 bg-[#111811] text-xs text-[rgba(232,221,208,0.2)]">
                No image
              </div>
            )}
          </div>

          {/* Details Metadata Content Wrapper */}
          <div className="min-w-0 pb-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                className="mx-auto mb-5 block max-h-[clamp(55px,10vh,100px)] max-w-[85%] object-contain object-left-bottom sm:mx-0"
              />
            ) : (
              <h1 className="mb-3.5 font-sans text-[clamp(1.6rem,4vw,3rem)] font-extrabold leading-none tracking-tight text-[#e8ddd0]">
                {title}
              </h1>
            )}

            <div className="mb-5 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              <StatPill color={getRatingColor(rating)}>★ {rating}</StatPill>
              {year && <StatPill>{year}</StatPill>}
              {runtime && <StatPill>{runtime}</StatPill>}
              {seasons && <StatPill>{seasons} Season{seasons !== 1 ? "s" : ""}</StatPill>}
              {episodes && <StatPill>{episodes} Episodes</StatPill>}
              {genres.slice(0, 3).map((g) => <StatPill key={g.id}>{g.name}</StatPill>)}
            </div>

            <p className="mx-auto mb-6 max-w-[680px] text-[clamp(0.85rem,1.1vw,0.95rem)] leading-relaxed text-[rgba(232,221,208,0.65)] sm:mx-0">
              {overview}
            </p>

            <div className="mb-2">
              <WatchPageClient
                type={type}
                id={id}
                validSeasons={validSeasons}
                isReleased={isReleased}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Secondary Content Rails */}
      <main className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-16">
        {cast.length > 0 && (
          <Section title="The Cast">
            <div className="scroll-row flex overflow-x-auto gap-[clamp(1rem,2vw,1.5rem)] py-2 px-1 [scrollbar-width:none]">
              {cast.map((actor) => (
                <div key={actor.id} className="w-[clamp(80px,12vw,100px)] flex-shrink-0 text-center">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="mx-auto mb-1.5 block h-[clamp(56px,8vw,68px)] w-[clamp(56px,8vw,68px)] rounded-full border-2 border-white/5 object-cover"
                    />
                  ) : (
                    <div className="mx-auto mb-1.5 flex h-[clamp(56px,8vw,68px)] w-[clamp(56px,8vw,68px)] items-center justify-center rounded-full border-2 border-white/5 bg-[#111811] opacity-30">
                      <User size={24} />
                    </div>
                  )}
                  <p className="line-clamp-2 text-[clamp(0.6rem,0.8vw,0.7rem)] font-semibold leading-tight text-[#e8ddd0]">{actor.name}</p>
                  <p className="line-clamp-1 mt-0.5 text-[clamp(0.5rem,0.7vw,0.6rem)] italic text-[rgba(232,221,208,0.3)]">{actor.character}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {backdrops.length > 0 && (
          <Section title="Stills">
            <div className="scroll-row flex overflow-x-auto gap-[clamp(0.5rem,1vw,0.75rem)] py-2 px-1 [scrollbar-width:none]">
              {backdrops.map((img, i) => (
                <div key={i} className="aspect-video w-[clamp(180px,30vw,260px)] flex-shrink-0 overflow-hidden rounded-md border border-white/5">
                  <img
                    src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {recommendations.length > 0 && (
          <Section title="You might also enjoy">
            <div className="scroll-row flex overflow-x-auto gap-[clamp(0.75rem,1.5vw,1rem)] py-2 px-1 [scrollbar-width:none]">
              {recommendations.map((item) => {
                const rPoster = item.poster_path
                  ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
                  : `https://placehold.co/400x600/1a221a/8a7a6a?text=No+Image`;
                const rTitle = item.title || item.name;
                const rYear = (item.release_date || item.first_air_date || "").split("-")[0];
                const rRating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
                return (
                  <Link key={item.id} href={`/watch/${type}/${item.id}`} className="block w-[clamp(120px,18vw,150px)] flex-shrink-0 no-underline">
                    <div className="overflow-hidden rounded-md border border-white/5 bg-[#111811]">
                      <div className="relative aspect-[2/3]">
                        <img src={rPoster} alt="" loading="lazy" className="block h-full w-full object-cover" />
                        <div className={`absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-[4px] ${getRatingColor(rRating)}`}>
                          ★ {rRating}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="line-clamp-2 text-xs font-medium leading-tight text-[#e8ddd0]">{rTitle}</p>
                        <p className="mt-0.5 text-[10px] text-[rgba(232,221,208,0.25)]">{rYear}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}

function StatPill({ children, color }) {
  return (
    <span className={`inline-flex items-center rounded border border-white/5 bg-white/[0.03] px-2 py-1 text-[10px] font-medium tracking-wide text-[rgba(232,221,208,0.5)] ${color || ''}`}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#e8ddd0]">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
      </div>
      {children}
    </section>
  );
}