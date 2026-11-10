import { useEffect, useRef, useState } from 'react';
import { ProjectMedia } from '../../types';

// The embedded site is laid out at a desktop viewport and scaled to fit, so
// visitors see the real desktop interface rather than a squeezed mobile one.
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;

interface LivePreviewProps {
  url: string;
  /** Accessible name of the embedded site. */
  title: string;
  /** Genuine screenshot shown until the live site has loaded. */
  poster?: ProjectMedia;
}

/**
 * A real, running embed of a deployed project.
 *
 * Controlled on purpose:
 * - it only starts loading when it scrolls near the viewport, and the
 *   screenshot is shown until the live page has fully loaded;
 * - the sandbox allows the site's own scripts but not top-level navigation,
 *   pop-ups, form submission or downloads;
 * - no referrer is sent;
 * - it ignores pointer input until the visitor clicks it, so scrolling the
 *   portfolio is never captured, and it locks again when the pointer leaves.
 */
export function LivePreview({ url, title, poster }: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resize = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / VIEWPORT_WIDTH);
    });
    resize.observe(element);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          visibility.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    visibility.observe(element);

    return () => {
      resize.disconnect();
      visibility.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setInteractive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [interactive]);

  return (
    <div ref={containerRef} className="live" onMouseLeave={() => setInteractive(false)}>
      {poster && (
        <img
          className="live__poster"
          src={poster.src}
          alt={loaded ? '' : poster.alt}
          width={poster.width}
          height={poster.height}
          decoding="async"
        />
      )}

      {shouldLoad && scale > 0 && (
        <iframe
          className={`live__frame ${loaded ? 'is-loaded' : ''}`}
          src={url}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          tabIndex={interactive ? 0 : -1}
          onLoad={() => setLoaded(true)}
          style={{
            width: VIEWPORT_WIDTH,
            height: VIEWPORT_HEIGHT,
            transform: `scale(${scale})`,
            pointerEvents: interactive ? 'auto' : 'none',
          }}
        />
      )}

      {!interactive && (
        <button
          type="button"
          className="live__shield"
          onClick={() => setInteractive(true)}
          aria-label={`Interact with the live preview of ${title}`}
        >
          <span className="live__hint">Click to interact</span>
        </button>
      )}
    </div>
  );
}
