'use client';
import { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import MovieCard from '../components/MovieCard';
import { fetchTMDB } from './api';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Optional: make sure Lucide is installed

export default function ExploreSection({ title, fetchUrl }) {
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const perView = 5;

  const [sliderRef, instanceRef] = useKeenSlider({
  slides: { perView, spacing: 16 },
  slideChanged(slider) {
    setCurrentSlide(Math.floor(slider.track.details.rel / perView));
  },
  created() {
    setLoaded(true);
  },
});


  useEffect(() => {
    async function loadData() {
      const data = await fetchTMDB(fetchUrl);
      setItems(data?.results || []);
    }
    loadData();
  }, [fetchUrl]);

  if (!items || items.length === 0) return null;

  const totalSlides = Math.ceil(items.length / perView);

  return (
  <section className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 mb-8">
    {/* ─── Header: title + arrows + dots ─────────────────────────── */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-4">
        {title}
      </h2>

      {loaded && instanceRef.current && (
        <div className="flex items-center gap-3">
          {/* LEFT ARROW — jumps an entire group of 5 */}
          <button
            onClick={() =>
              instanceRef.current?.moveToIdx(
                Math.max((currentSlide - 1) * perView, 0)
              )
            }
            className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition text-white"
          >
            <ChevronLeft size={20} />
          </button>

          {/* DOTS */}
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }, (_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition ${
                  currentSlide === idx
                    ? 'bg-red-500'
                    : 'bg-red-500/30'   /* inactive dots are the same red, just faded */
                }`}
              />
            ))}
          </div>

          {/* RIGHT ARROW — jumps an entire group of 5 */}
          <button
            onClick={() =>
              instanceRef.current?.moveToIdx(
                Math.min((currentSlide + 1) * perView, (totalSlides - 1) * perView)
              )
            }
            className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>

    {/* ─── Slider ──────────────────────────────────────────────── */}
    <div ref={sliderRef} className="keen-slider">
      {items.map((item) => (
        <div className="keen-slider__slide" key={item.id}>
          <MovieCard data={item} />
        </div>
      ))}
    </div>
  </section>
);

}
