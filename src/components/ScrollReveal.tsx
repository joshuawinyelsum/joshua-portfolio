import { ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
}: ScrollRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.08 });
  const reducedMotion = useReducedMotion();

  const getTransform = () => {
    if (reducedMotion || direction === 'none') return 'none';
    const d = distance;
    switch (direction) {
      case 'up': return `translateY(${d}px)`;
      case 'down': return `translateY(-${d}px)`;
      case 'left': return `translateX(${d}px)`;
      case 'right': return `translateX(-${d}px)`;
      default: return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0) translateX(0)' : getTransform(),
        transition: reducedMotion
          ? 'none'
          : `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: isInView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
