import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  className?: string;
};

export function PlaceImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`place-image-fallback ${className ?? ""}`}>
        <span>NO IMAGE</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
