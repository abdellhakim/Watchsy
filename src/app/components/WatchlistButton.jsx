'use client';

import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function WatchlistButton({ mediaId, type, variant = 'text' }) {
  const { user } = useUser();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfInWatchlist = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api_test/tmdb/favorites/check?mediaId=${mediaId}&userId=${user.id}`);
        const result = await res.json();
        if (result.isFavorite) setAdded(true);
      } catch (err) {
        console.error('Erreur vérification favori');
      } finally {
        setLoading(false);
      }
    };
    checkIfInWatchlist();
  }, [mediaId, user?.id]);

  const handleClick = async () => {
    try {
      const res = await fetch('/api_test/tmdb/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, type, userId: user?.id }),
      });

      const result = await res.json();
      if (result.success) setAdded(true);
      else alert(result.message || 'Erreur ajout');
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  if (loading) return null;

  // Deux rendus selon le variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={added}
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded bg-white/20 hover:bg-white/30 backdrop-blur text-white transition"
        aria-label="Ajouter à la watchlist"
      >
        {added ? '✓' : <PlusIcon size={22} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`mt-4 w-full p-2 rounded text-white transition-colors duration-300 
        ${added
          ? 'bg-green-600 cursor-default'
          : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}
      `}
    >
      {added ? '✓ Added to Watchlist' : '➕ Add to Watchlist'}
    </button>
  );
}
