import { TimelineItem as TimelineItemType } from '../types';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TimelineItemProps {
  item: TimelineItemType;
  index: number;
  isLast: boolean;
}

export function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const { ref, isInView } = useInView({ threshold: 0.4, triggerOnce: false });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="relative pl-10 md:pl-14">
      {/* Vertical line */}
      {!isLast && (
        <div
          className="absolute left-[13px] md:left-[17px] top-8 bottom-0 w-px origin-top"
          style={{
            background: isInView
              ? 'linear-gradient(to bottom, #111111, #D1D5DB)'
              : '#D1D5DB',
            transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
            transition: reducedMotion ? 'none' : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, background 0.5s ease',
          }}
        />
      )}

      {/* Dot */}
      <div
        className="absolute left-1 md:left-2 top-1 w-[16px] h-[16px] md:w-[18px] md:h-[18px] rounded-full border-2"
        style={{
          backgroundColor: isInView ? '#111111' : 'transparent',
          borderColor: isInView ? '#111111' : '#D1D5DB',
          transform: isInView ? 'scale(1)' : 'scale(0.6)',
          boxShadow: isInView ? '0 0 0 4px rgba(17,17,17,0.08)' : 'none',
          transition: reducedMotion ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Content */}
      <div
        className="pb-14 md:pb-18"
        style={{
          opacity: isInView ? 1 : 0.35,
          transform: isInView ? 'none' : 'translateY(12px)',
          transition: reducedMotion
            ? 'none'
            : `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms`,
        }}
      >
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">
          {item.year}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-3">
          {item.title}
        </h3>
        <p className="text-[15px] text-gray-600 leading-[1.75] max-w-lg">
          {item.description}
        </p>
        {item.detail && (
          <p className="text-sm text-gray-500 leading-relaxed mt-2.5 max-w-lg">
            {item.detail}
          </p>
        )}
      </div>
    </div>
  );
}
