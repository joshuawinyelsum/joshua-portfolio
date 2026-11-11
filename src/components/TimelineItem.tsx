import { TimelineItem as TimelineItemType } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface TimelineItemProps {
  item: TimelineItemType;
  /** Where the journey starts and where it stands now: larger type and marker. */
  major: boolean;
  /** The present day: cream date label. */
  current: boolean;
}

/**
 * One milestone on the story rail. The date and marker are always visible
 * and respond to scroll progress; the text settles in once, in sequence,
 * and never hides again.
 */
export function TimelineItem({ item, major, current }: TimelineItemProps) {
  const classes = ['story__item', major ? 'story__item--major' : '', current ? 'story__item--current' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classes} data-milestone>
      <span className="story__marker" aria-hidden="true" />
      <div className="story__date-cell">
        <p className="story__date">{item.year}</p>
      </div>

      <ScrollReveal className="w-full">
        <div className="group rounded-2xl border border-brand-charcoal/[0.08] bg-surface/90 backdrop-blur-xs p-6 sm:p-7 transition-all duration-300 hover:border-brand-lavender/40 hover:bg-surface hover:shadow-[0_8px_24px_rgba(155,123,247,0.06)]">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider ${
                current
                  ? 'bg-brand-cream/45 border border-brand-charcoal/10 text-brand-charcoal'
                  : 'bg-brand-lavender/10 border border-brand-lavender/20 text-brand-lavender'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${current ? 'bg-accent' : 'bg-brand-lavender'}`} aria-hidden="true" />
              {item.year}
            </span>
            {current && (
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                Active Focus
              </span>
            )}
          </div>

          <h3 className={`mt-3 font-bold text-ink tracking-tight group-hover:text-accent transition-colors duration-200 ${major ? 'text-title-lg' : 'text-title'}`}>
            {item.title}
          </h3>

          <p className="mt-2 text-body text-ink-soft leading-relaxed">
            {item.description}
          </p>

          {item.detail && (
            <div className="mt-3.5 border-l-2 border-brand-lavender/40 pl-3.5 py-0.5 text-small text-ink-muted leading-relaxed">
              {item.detail}
            </div>
          )}
        </div>
      </ScrollReveal>
    </li>
  );
}
