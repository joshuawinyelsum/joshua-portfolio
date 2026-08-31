import { useEffect, useRef, useState } from 'react';

export function useScrollProgress(offset = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const elementTop = rect.top - offset;
          const elementHeight = rect.height;

          // 0 when element top enters viewport, 1 when element bottom leaves viewport
          const rawProgress = (windowHeight - elementTop) / (windowHeight + elementHeight);
          setProgress(Math.max(0, Math.min(1, rawProgress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return { ref, progress };
}
