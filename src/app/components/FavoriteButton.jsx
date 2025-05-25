'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ mediaId, type, userId }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch(`/api_test/tmdb/favorites/check?mediaId=${mediaId}&userId=${userId}`);
        const result = await res.json();
        setLiked(result.isFavorite);
      } catch (err) {
        console.error('Erreur lors de la vérification du favori');
      } finally {
        setLoading(false);
      }
    };

    checkFavorite();
  }, [mediaId, userId]);

  const toggleFavorite = async () => {
    try {
      if (liked) {
        const res = await fetch(`/api_test/tmdb/favorites`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaId, userId }),
        });
        const result = await res.json();
        if (!result.success) throw new Error();
      } else {
        const res = await fetch('/api_test/tmdb/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaId, type, userId }),
        });
        const result = await res.json();
        if (!result.success) throw new Error();
      }

      setLiked(!liked); // toggle après succès
    } catch (err) {
      alert('Erreur lors de la mise à jour des favoris');
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
      title={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
     
    </button>
  );
}
