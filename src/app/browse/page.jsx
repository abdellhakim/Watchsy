'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/app/components/MovieCard';
import FilterBar from './FilterBar';
import { getGenres, discover } from './tmdb';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* state */
  const [genres, setGenres] = useState([]);
  const [mediaType, setMediaType] = useState(searchParams.get('type') || 'movie');
  const [genreId, setGenreId] = useState(Number(searchParams.get('genre')) || null);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [data, setData] = useState(null);

  /* fetch genre list once */
  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  /* update query string */
  const syncQuery = useCallback(
    () =>
      router.push(
        `/browse?type=${mediaType}&page=${page}${genreId ? `&genre=${genreId}` : ''}${
          search ? `&q=${encodeURIComponent(search)}` : ''
        }`,
        { scroll: false }
      ),
    [mediaType, page, genreId, search, router]
  );

  /* fetch discover/search every time params change */
  useEffect(() => {
    syncQuery();
    discover({ type: mediaType, page, genreId, query: search }).then(setData);
  }, [mediaType, genreId, page, search, syncQuery]);

  if (!data) return <p className="text-white p-8">Loading…</p>;

  const totalPages = Math.min(data.total_pages, 500); // TMDB max 500

  return (
    <div className="bg-black min-h-screen text-white">
      <FilterBar
        genres={genres}
        activeGenre={genreId}
        setGenre={g => {
          setGenreId(g);
          setPage(1);
        }}
        mediaType={mediaType}
        setMediaType={t => {
          setMediaType(t);
          setPage(1);
        }}
        search={search}
        setSearch={txt => {
          setSearch(txt);
          setPage(1);
        }}
      />

      {/* grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.results.map(item => (
          <MovieCard key={item.id} data={item} />
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-center gap-4 pb-12">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="pt-2 text-sm">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
