import { ExperienceItem } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { ArrowLink } from './ui/ArrowLink';
import { Tag } from './ui/Tag';

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
}

/** One role in the experience list: an editorial row, no surface. */
export function ExperienceCard({ item, index }: ExperienceCardProps) {
  return (
    <li>
      <ScrollReveal
        delay={index * 80}
        className="grid gap-x-10 gap-y-3 py-8 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]"
      >
        <div>
          <h3 className="text-title font-bold text-ink">{item.company}</h3>
          {item.programme && <p className="mt-1 text-small text-ink-muted">{item.programme}</p>}
          <p className="mt-1 text-small font-medium text-accent">{item.role}</p>
        </div>
        <div>
          <p className="max-w-2xl text-body text-ink-soft">{item.description}</p>
          {item.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          )}
          {item.project && (
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              {item.project.evidencePath && <ArrowLink to={item.project.evidencePath}>Project evidence</ArrowLink>}
              <ArrowLink href={item.project.url} external>
                Open {item.project.name}
              </ArrowLink>
            </div>
          )}
        </div>
      </ScrollReveal>
    </li>
  );
}
