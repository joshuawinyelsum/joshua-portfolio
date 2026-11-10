import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'none';
}

/**
 * Section entrance. Content fades up once when it first enters the viewport
 * and then stays put; it never hides again while scrolling. Timing, distance
 * and easing come from the motion tokens via the `.reveal` class.
 */
export function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: ScrollRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.08 });

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? 'is-visible' : ''} ${className}`}
      data-direction={direction}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
