import { Tag } from '../ui/Tag';
import { ArrowLink } from '../ui/ArrowLink';
import type { LeadershipEntryData } from '../../data/leadership';

interface LeadershipEntryProps {
  entry: LeadershipEntryData;
}

export function LeadershipEntry({ entry }: LeadershipEntryProps) {
  const { organization, role, description, focusAreas, links } = entry;

  return (
    <article className="flex h-full flex-col justify-between py-2">
      <div className="space-y-4">
        <div>
          <h3 className="text-title font-bold text-ink">{organization.name}</h3>
          {organization.badge && (
            <p className="mt-0.5 text-small text-ink-muted">{organization.badge}</p>
          )}
        </div>

        <div className="border-t border-line/10 pt-3">
          <p className="text-small font-semibold text-accent">{role}</p>
          <p className="mt-2 text-body text-ink-soft leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-line/10 pt-3">
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
