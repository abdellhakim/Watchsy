import { useEffect } from 'react';

export default function useHorizontalScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wheel = e => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: 'smooth',
      });
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [ref]);
}
