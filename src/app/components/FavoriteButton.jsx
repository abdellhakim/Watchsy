import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ mediaId, type }) {
  const [liked, setLiked] = useState(false);

  const toggleFavorite = () => {
    setLiked(!liked);
    // TODO: Save to backend/favorites list
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
    >
      <Heart fill={liked ? 'red' : 'none'} color="white" size={24} />
    </button>
  );
}
