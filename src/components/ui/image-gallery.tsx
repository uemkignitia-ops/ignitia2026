import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { ImageOff } from 'lucide-react';

interface GalleryItem {
  title: string;
  category: string;
  color?: string;
  span?: string;
  src: string;
  isPlaceholder?: boolean;
}

interface ImageGalleryProps {
  items: GalleryItem[];
  onImageClick?: (item: GalleryItem) => void;
  /** When true every card shows a "Coming Soon" overlay */
  isPlaceholder?: boolean;
}

export function ImageGallery({ items, onImageClick, isPlaceholder }: ImageGalleryProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <ImageOff size={40} className="opacity-25" />
        <p className="text-xs font-medium opacity-40 uppercase tracking-widest">No photos yet</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-8">
      {/*
        Uniform square grid:
          mobile  → 3 columns
          sm      → 4 columns
          lg      → 5 columns
        Each cell is a square via padding-bottom trick.
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isPh = isPlaceholder || item.isPlaceholder;
          return (
            <div
              key={(item as any).id ?? index}
              className={cn(
                'relative group overflow-hidden rounded-md sm:rounded-lg',
                'aspect-square',                          // always square
                isPh ? 'cursor-default' : 'cursor-pointer'
              )}
              onClick={() => {
                if (!isPh) onImageClick?.(item);
              }}
            >
              <GridImage
                src={item.src}
                alt={item.title}
                isPlaceholder={isPh}
              />

              {/* Real-image hover overlay */}
              {!isPh && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col justify-end p-1.5 sm:p-2.5">
                  <span className="text-[8px] sm:text-[10px] text-primary font-semibold uppercase tracking-wider leading-none mb-0.5 truncate">
                    {item.category}
                  </span>
                  <p className="text-[9px] sm:text-xs font-medium text-white leading-tight line-clamp-1">
                    {item.title}
                  </p>
                </div>
              )}

              {/* Placeholder overlay — just a dim scrim + category label */}
              {isPh && (
                <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/60 via-transparent to-transparent p-1.5">
                  <span className="text-white/50 font-medium text-[7px] sm:text-[9px] tracking-wide leading-none">
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Grid Image Cell ───────────────────────────────────────────────────────────

interface GridImageProps {
  src: string;
  alt: string;
  isPlaceholder?: boolean;
}

function GridImage({ src, alt, isPlaceholder }: GridImageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => {
    setImgSrc(src);
    setLoaded(false);
    setErrored(false);
  }, [src]);

  return (
    <div ref={ref} className="absolute inset-0 bg-card/60">
      {/* Shimmer */}
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/4 via-white/8 to-white/4" />
      )}

      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff size={18} className="text-muted-foreground/25" />
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            isInView && loaded ? 'opacity-100' : 'opacity-0',
            isPlaceholder && 'brightness-[0.65]'
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
