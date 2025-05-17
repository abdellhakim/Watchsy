'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ExploreSection from './ExploreSection';

export default function ExplorePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <h1 className="text-3xl font-bold">Explore</h1>

        <ExploreSection title="Trending Now" fetchUrl="trending/all/week" />
        <ExploreSection title="New Releases" fetchUrl="movie/now_playing" />
        <ExploreSection title="Must-Watch Movies" fetchUrl="movie/top_rated" />
        <ExploreSection title="Popular TV Shows" fetchUrl="tv/popular" />
        <ExploreSection title="Top Rated TV Shows" fetchUrl="tv/top_rated" />
      </div>
    </div>
  );
}
