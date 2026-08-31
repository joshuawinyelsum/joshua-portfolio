import { SectionHeader } from '../components/SectionHeader';
import { TimelineItem } from '../components/TimelineItem';
import { timeline } from '../data/timeline';

export function Story() {
  return (
    <section id="story" className="py-24 md:py-32 section-padding">
      <div className="max-w-3xl">
        <SectionHeader
          title="My Story"
          subtitle="A journey of curiosity, code, and purpose."
        />
        <div className="mt-12">
          {timeline.map((item, index) => (
            <TimelineItem
              key={item.year}
              item={item}
              index={index}
              isLast={index === timeline.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
