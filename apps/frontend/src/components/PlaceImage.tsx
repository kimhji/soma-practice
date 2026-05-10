import { useEffect, useMemo, useState } from 'react';

type Props = {
  src?: string;
  alt: string;
  className?: string;
};

const FALLBACKS = Array.from({ length: 30 }, (_, index) => {
  const n = String(index + 1).padStart(2, '0');
  return `/assets/quests/fallback/fallback-${n}.png`;
});

export function PlaceImage({ src, alt, className }: Props) {
  const fallback = useMemo(() => FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)], []);
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={currentSrc || fallback}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setCurrentSrc(fallback)}
    />
  );
}
