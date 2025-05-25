'use client';
import { useEffect, useRef } from 'react';
import useHorizontalScroll from './useMediaQuery';

export default function FilterBar({
  genres,
  activeGenre,
  setGenre,
  mediaType,
  setMediaType,
  search,
  setSearch,
}) {
  const scrollRef = useRef(null);
  useHorizontalScroll(scrollRef);

  return (
    <>
      {/* ── Search bar (NON‑sticky) ────────────────────────────── */}
      <div className="bg-black px-4 pt-4">
        <div className="relative w-full max-w-md mt-2 mb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies or shows..."
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
            >
              {/* X icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 11-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 11-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Sticky filter chips ───────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-zinc-800 py-3">
        <div
          className="flex items-center gap-4 overflow-x-auto px-4 scrollbar-hide"
          ref={scrollRef}
        >
          {/* fixed mediaType chips */}
          {['movie', 'tv'].map((t) => (
            <button
              key={t}
              onClick={() => setMediaType(t)}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
                mediaType === t
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-gray-300'
              }`}
            >
              {t === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}

          {/* divider */}
          <span className="w-px h-6 bg-zinc-700 mx-2 shrink-0" />

          {/* genre chips */}
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenre(g.id === activeGenre ? null : g.id)}
              className={`px-4 py-1 mb-2 rounded-full text-sm whitespace-nowrap ${
                activeGenre === g.id
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-gray-300'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
