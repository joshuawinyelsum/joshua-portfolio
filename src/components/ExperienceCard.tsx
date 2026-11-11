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
    <li className="list-none">
      <ScrollReveal
        delay={index * 80}
        className="rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.04)]"
      >
        <div className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] items-start">
          <div>
            <h3 className="text-title font-bold text-ink tracking-tight">{item.company}</h3>
            {item.programme && <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-muted">{item.programme}</p>}
            <p className="mt-1 text-small font-semibold text-accent">{item.role}</p>
          </div>
          <div>
            <p className="max-w-2xl text-body text-ink-soft leading-relaxed">{item.description}</p>
            {item.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            )}
            {item.project && (
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 pt-3 border-t border-line/10">
                {item.project.evidencePath && (
                  <ArrowLink to={item.project.evidencePath} className="font-semibold text-small">
                    Project evidence
                  </ArrowLink>
                )}
                <ArrowLink href={item.project.url} external className="font-semibold text-small">
                  Open {item.project.name}
                </ArrowLink>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </li>
  );
}
