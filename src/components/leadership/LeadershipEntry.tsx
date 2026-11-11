import { Tag } from '../ui/Tag';
import { ArrowLink } from '../ui/ArrowLink';
import type { LeadershipEntryData } from '../../data/leadership';

interface LeadershipEntryProps {
  entry: LeadershipEntryData;
}

export function LeadershipEntry({ entry }: LeadershipEntryProps) {
  const { organization, role, description, focusAreas, links } = entry;

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-7 sm:p-8 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
      <div className="space-y-4">
        <div>
          <h3 className="text-title font-bold text-ink tracking-tight">{organization.name}</h3>
          {organization.badge && (
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-muted">{organization.badge}</p>
          )}
        </div>

        <div className="border-t border-line/10 pt-3.5">
          <p className="text-small font-semibold text-accent">{role}</p>
          <p className="mt-2 text-body text-ink-soft leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-line/10 pt-4">
        {focusAreas && focusAreas.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {focusAreas.map((area) => (
              <li key={area}>
                <Tag>{area}</Tag>
              </li>
            ))}
          </ul>
        )}

        {links && links.length > 0 && (
          <div className="pt-1">
            {links.map((link) => (
              <ArrowLink
                key={link.label}
                href={link.isExternal ? link.url : undefined}
                to={!link.isExternal ? link.url : undefined}
                external={link.isExternal}
                className="font-semibold text-small"
              >
                {link.label}
              </ArrowLink>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
