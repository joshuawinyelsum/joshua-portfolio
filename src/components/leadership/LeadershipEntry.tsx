import { Users, Code, ArrowUpRight } from 'lucide-react';
import { LayeredSurface } from '../ui/LayeredSurface';
import { OrganizationIdentity } from './OrganizationIdentity';
import { EvidenceLink } from './EvidenceLink';
import type { LeadershipEntryData } from '../../data/leadership';

interface LeadershipEntryProps {
  entry: LeadershipEntryData;
}

export function LeadershipEntry({ entry }: LeadershipEntryProps) {
  const { area, organization, role, description, focusAreas, team, links } = entry;

  const stack = area === 'collaboration' ? 'crown' : 'offset';
  const accent = area === 'community' ? 'cream' : 'lavender';

  return (
    <LayeredSurface stack={stack} accent={accent} className="h-full">
      <div className="flex h-full flex-col justify-between space-y-6">
        <div className="space-y-5">
          {/* Header */}
          <OrganizationIdentity
            name={organization.name}
            programme={organization.programme}
            institution={organization.institution}
            badge={organization.badge}
            badgeTone={organization.badgeTone}
          />

          {/* Position / Role */}
          <div className="border-t border-line/10 pt-4">
            <p className="eyebrow !text-accent">
              {area === 'collaboration' ? 'Collaborative Engineering Role' : 'Role & Focus'}
            </p>
            <h4 className="mt-1 text-h3 font-extrabold text-ink">{role}</h4>
          </div>

          {/* Factual Description */}
          <p className="text-body text-ink-soft leading-relaxed">{description}</p>

          {/* Focus Areas for Community */}
          {focusAreas && focusAreas.length > 0 && (
            <div className="space-y-2 border-t border-line/10 pt-4">
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                Core Initiatives & Focus
              </p>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((areaItem) => (
                  <span
                    key={areaItem}
                    className="inline-flex items-center gap-1.5 rounded-control bg-sunken px-2.5 py-1 text-xs font-medium text-ink-soft"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cream" aria-hidden="true" />
                    <span>{areaItem}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Team Collaboration for MABIA AI */}
          {team && team.length > 0 && (
            <div className="space-y-2.5 border-t border-line/10 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-accent" strokeWidth={2} aria-hidden="true" />
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                  Multidisciplinary Engineering Team (Source: README)
                </p>
              </div>
              <ul className="space-y-2 rounded-control bg-sunken p-3 text-small">
                {team.map((member) => (
                  <li key={member.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className={`font-semibold ${member.isSelf ? 'text-accent' : 'text-ink'}`}>
                      {member.name}
                      {member.isSelf && <span className="ml-1 text-[11px] font-mono font-normal text-ink-muted">(Self)</span>}
                      :
                    </span>
                    <span className="text-ink-soft text-xs">{member.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action / Evidence Links */}
        {links && links.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 border-t border-line/10 pt-4">
            {links.map((link) => (
              <EvidenceLink
                key={link.label}
                label={link.label}
                url={link.url}
                isExternal={link.isExternal}
              />
            ))}
          </div>
        )}
      </div>
    </LayeredSurface>
  );
}
