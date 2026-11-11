import { useEffect, useRef } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { TimelineItem } from '../components/TimelineItem';
import { timeline } from '../data/timeline';
import { useReducedMotion } from '../hooks/useReducedMotion';

// The rail fills up to this fraction of the viewport height, so a milestone
// becomes active a little after it has scrolled comfortably into view.
const TRIGGER = 0.62;
// Matches the rail's top/bottom inset in the stylesheet (0.5rem).
const RAIL_INSET = 8;
// Distance from the top of a milestone to the centre of its marker.
const MARKER_CENTRE = 12;

export function Story() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-milestone]'));

    // Without motion the story is simply shown complete.
    if (reducedMotion) {
      list.style.setProperty('--story-ratio', '1');
      items.forEach((item) => item.classList.add('is-active'));
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const railHeight = Math.max(rect.height - RAIL_INSET * 2, 1);
      const filled = Math.min(Math.max(window.innerHeight * TRIGGER - rect.top - RAIL_INSET, 0), railHeight);

      list.style.setProperty('--story-ratio', (filled / railHeight).toFixed(4));
      for (const item of items) {
        item.classList.toggle('is-active', filled >= item.offsetTop + MARKER_CENTRE - RAIL_INSET);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reducedMotion]);

  return (
    <section id="story" className="section pb-24 sm:pb-28">
      <div className="container-content grid items-start gap-x-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-28">
          <SectionHeader title="My Story" subtitle="A journey of curiosity, code, and purpose." accent="purpose." />
        </div>

        <ol ref={listRef} className="story">
          <li className="story__rail" aria-hidden="true" />
          <li className="story__progress" aria-hidden="true" />
          {timeline.map((item, index) => (
            <TimelineItem
              key={item.year}
              item={item}
              major={index === 0 || index === timeline.length - 1}
              current={index === timeline.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
