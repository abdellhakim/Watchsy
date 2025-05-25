'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ExploreSection from './ExploreSection';
import ExploreHero from './ExploreHero';

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
        <ExploreHero />
        
<div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold">Explore</h1>
  <a
    href="/browse"
    className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-sm text-white hover:bg-white/10 transition flex items-center gap-2 shadow-md"
  >
    Explore all
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </a>
</div>

        <ExploreSection title="Trending Now" fetchUrl="trending/all/week" />
        <ExploreSection title="New Releases" fetchUrl="movie/now_playing" />
        <ExploreSection title="Must-Watch Movies" fetchUrl="movie/top_rated" />
        <ExploreSection title="Popular TV Shows" fetchUrl="tv/popular" />
        <ExploreSection title="Top Rated TV Shows" fetchUrl="tv/top_rated" />
      </div>
    </div>
  );
}
