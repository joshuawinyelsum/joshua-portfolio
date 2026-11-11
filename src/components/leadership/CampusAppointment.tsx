import { ShieldCheck } from 'lucide-react';
import { Tag } from '../ui/Tag';
import type { LeadershipEntryData } from '../../data/leadership';

interface CampusAppointmentProps {
  entry: LeadershipEntryData;
}

export function CampusAppointment({ entry }: CampusAppointmentProps) {
  const { organization, role, description, focusAreas, appointmentStatus } = entry;

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-7 sm:p-8 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2.5">
          <div>
            <h3 className="text-title font-bold text-ink tracking-tight">{organization.name}</h3>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-muted">
              {organization.programme && <span className="font-semibold text-ink-soft">{organization.programme}</span>}
              {organization.programme && organization.institution && <span className="mx-1.5 text-line">·</span>}
              {organization.institution && <span>{organization.institution}</span>}
            </p>
          </div>
          {appointmentStatus && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-brand-lavender/10 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-accent">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>{appointmentStatus}</span>
            </span>
          )}
        </div>

        <div className="border-t border-line/10 pt-3.5">
          <p className="text-small font-semibold text-accent">{role}</p>
          <p className="mt-2 text-body text-ink-soft leading-relaxed">{description}</p>
        </div>
      </div>

      {focusAreas && focusAreas.length > 0 && (
        <div className="mt-6 border-t border-line/10 pt-4">
          <ul className="flex flex-wrap gap-1.5">
            {focusAreas.map((area) => (
              <li key={area}>
                <Tag>{area}</Tag>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
