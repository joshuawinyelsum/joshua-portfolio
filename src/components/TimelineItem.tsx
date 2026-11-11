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

      <ScrollReveal>
        <h3 className={`mt-2 font-bold text-ink md:mt-0 ${major ? 'text-title-lg' : 'text-title'}`}>{item.title}</h3>
      </ScrollReveal>
      <ScrollReveal delay={90}>
        <p className={`mt-2 max-w-xl text-ink-soft ${major ? 'text-lead' : 'text-body'}`}>{item.description}</p>
      </ScrollReveal>
      {item.detail && (
        <ScrollReveal delay={180}>
          <p className="mt-3 max-w-xl text-small text-ink-muted">{item.detail}</p>
        </ScrollReveal>
      )}
    </li>
  );
}
