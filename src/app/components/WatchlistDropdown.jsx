import { useState } from 'react';

export default function WatchlistDropdown({ mediaId, type }) {
  const [selected, setSelected] = useState('');

  const handleSelect = (e) => {
    setSelected(e.target.value);
    // TODO: Save to backend/watchlist
  };

  return (
    <select
      value={selected}
      onChange={handleSelect}
      className="mt-4 w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
    >
      <option value="">Add to List</option>
      <option value="watching">Watching Now</option>
      <option value="later">To Watch Later</option>
      <option value="watched">Watched</option>
    </select>
  );
}
