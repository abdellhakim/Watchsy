// src/app/components/MovieCard.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function MovieCard({ data }) {
  const {
    id,
    title,
    name,
    poster_path,
    vote_average,
    release_date,
    first_air_date,
    media_type,
  } = data;

  // Determine content type: fallback to 'movie' if media_type is missing
  const contentType = media_type || (first_air_date ? 'tv' : 'movie');
  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;

  return (
    <Link href={`/details/${contentType}/${id}`} className="block">
      <div className="bg-zinc-900 rounded-lg overflow-hidden shadow hover:scale-105 transition transform duration-300 cursor-pointer">
        <Image
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={displayTitle}
          width={220}
          height={330}
          className="w-full h-auto"
        />
        <div className="p-2">
          <h3 className="text-sm font-semibold truncate">{displayTitle}</h3>
          <p className="text-xs text-gray-400">
            {displayDate} • ⭐ {vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}
