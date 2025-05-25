'use client';
import WatchlistButton from '../components/WatchlistButton';
import { useEffect, useState, useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart as HeartIcon,
  Plus as PlusIcon,
  Info as InfoIcon,
} from 'lucide-react';
import { fetchTMDB } from './api';

async function getHeroItems() {
  const endpoints = [
    'movie/now_playing',
    'movie/top_rated',
    'tv/top_rated',
    'tv/popular',
  ];
  const results = await Promise.all(endpoints.map(fetchTMDB));
  const merged = results.flatMap((r) => r.results);
  return merged.sort(() => 0.5 - Math.random()).slice(0, 5);
}

export default function ExploreHero() {
  /* top‑level state */
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null); // index of open dropdown
  const [likedIds, setLikedIds] = useState(new Set());    // track favourites
  const timerRef = useRef(null);

  /* slider */
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        timerRef.current = setInterval(() => {
          instanceRef.current?.next();
        }, 5000);
      },
      destroyed() {
        clearInterval(timerRef.current);
      },
    },
    []
  );

  /* fetch hero data once */
  useEffect(() => {
    getHeroItems().then(setItems);
    return () => clearInterval(timerRef.current);
  }, []);

  /* helpers */
  const squareBtn =
    'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded bg-white/20 hover:bg-white/30 backdrop-blur text-white transition';

  const toggleLike = (id) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (!items.length) return null;
  const total = items.length;

  return (
    <section className="relative w-full h-[75vh] rounded-2xl overflow-hidden mb-12">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider h-full">
        {items.map((item, idx) => {
          const title = item.title || item.name;
          const overview = item.overview?.slice(0, 150) + '…';
          const bg = `https://image.tmdb.org/t/p/original${
            item.backdrop_path || item.poster_path
          }`;
          const contentType =
            item.media_type || (item.first_air_date ? 'tv' : 'movie');
          const liked = likedIds.has(item.id);

          return (
            <div key={item.id} className="keen-slider__slide relative h-full">
              <Image src={bg} alt={title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

              {/* Text & actions */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                  {title}
                </h2>
                <p className="max-w-2xl mt-4 text-sm md:text-base text-gray-300">
                  {overview}
                </p>

                {/* 2 square buttons */}
                <div className="flex gap-6 mt-8 relative">
                

                  {/* + List dropdown */}
                  <div className="relative">
                    <WatchlistButton mediaId={item.id} type={contentType} variant="icon" />

                  </div>

                  {/* Info */}
                  <Link
                    href={`/details/${contentType}/${item.id}`}
                    className={squareBtn}
                    aria-label="Details"
                  >
                    <InfoIcon size={22} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur"
      >
        ‹
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur"
      >
        ›
      </button>

      {/* Dots with active indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            onClick={() => instanceRef.current?.moveToIdx(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              currentSlide === i ? 'bg-red-500' : 'bg-red-500/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
