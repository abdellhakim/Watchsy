'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import FavoriteButton from '../../../components/FavoriteButton';
import WatchlistDropdown from '../../../components/WatchlistDropdown';
import CommentSection from '../../../components/CommentSection';
import EpisodeList from '../../../components/EpisodeList';

export default function DetailPage() {
  const { type, id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const endpoint = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`;

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, [endpoint]);

  if (!data) return <p className="text-white text-center mt-10">Loading...</p>;

  const isTV = type === 'tv';
  const title = data.title || data.name;
  const overview = data.overview;
  const releaseDate = data.release_date || data.first_air_date;
  const genres = data.genres?.map(g => g.name).join(', ');
  const duration = data.runtime ? `${data.runtime} min` : isTV ? `${data.number_of_seasons} seasons` : 'N/A';
  const rating = data.vote_average?.toFixed(1);
  const banner = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '/default-banner.jpg';
  const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/default-poster.jpg';

  return (
    <>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>

    <SignedIn>
      <main className="bg-black text-white font-sans min-h-screen">
        {/* Banner */}
        <section className="relative h-[60vh] w-full border-b border-gray-700">
          <Image src={banner} alt={`${title} Banner`} fill className="object-cover opacity-60" />
          <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-5xl font-bold">{title}</h1>
            <p className="mt-2 text-lg">{overview.slice(0, 100)}...</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-8 border-b border-gray-700 py-4 mt-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`text-lg font-medium ${activeTab === 'about' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
          >
            About
          </button>
          {isTV && (
            <button
              onClick={() => setActiveTab('seasons')}
              className={`text-lg font-medium ${activeTab === 'seasons' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
            >
              Seasons
            </button>
          )}
        </div>

        {/* Tabs */}
        {activeTab === 'about' && (
          <section className="px-8 py-12 flex flex-col lg:flex-row gap-12">
            {/* Poster + Actions */}
            <div className="lg:w-1/3 relative">
              <Image src={poster} alt="Poster" width={300} height={450} className="rounded-xl" />
              <FavoriteButton mediaId={id} type={type} />
              <WatchlistDropdown mediaId={id} type={type} />
            </div>

            {/* Details */}
            <div className="lg:w-2/3 space-y-4">
              <h2 className="text-3xl font-bold">{title}</h2>
              <p className="text-gray-400">{overview}</p>
              <ul className="space-y-2 text-gray-300 pt-4">
                <li><strong className="text-white">Genres:</strong> {genres}</li>
                <li><strong className="text-white">Release Date:</strong> {releaseDate}</li>
                <li><strong className="text-white">Duration:</strong> {duration}</li>
                <li><strong className="text-white">Rating:</strong> ⭐ {rating}/10</li>
              </ul>
            </div>
          </section>
        )}

        {activeTab === 'seasons' && isTV && (
          <EpisodeList tvId={id} />
        )}

        {/* Comments */}
        <CommentSection mediaId={id} />
      </main>
    </SignedIn>
    </>
  );
}
