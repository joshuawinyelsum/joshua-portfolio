import { Award, ShieldCheck } from 'lucide-react';
import { LayeredSurface } from '../ui/LayeredSurface';
import { OrganizationIdentity } from './OrganizationIdentity';
import type { LeadershipEntryData } from '../../data/leadership';

interface CampusAppointmentProps {
  entry: LeadershipEntryData;
}

export function CampusAppointment({ entry }: CampusAppointmentProps) {
  const { organization, role, description, focusAreas, appointmentStatus } = entry;

  return (
    <LayeredSurface stack="offset" accent="lavender" className="h-full">
      <div className="flex h-full flex-col justify-between space-y-6">
        <div className="space-y-5">
          {/* Official Appointment Badge & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <OrganizationIdentity
              name={organization.name}
              programme={organization.programme}
              institution={organization.institution}
              badge={organization.badge}
              badgeTone="lavender"
            />
            {appointmentStatus && (
              <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-md bg-lavender/15 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-accent">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                <span>{appointmentStatus}</span>
              </div>
            )}
          </div>

          {/* Role designation */}
          <div className="border-t border-line/10 pt-4">
            <p className="eyebrow !text-accent">Official Position</p>
            <h4 className="mt-1 text-h3 font-extrabold text-ink">{role}</h4>
          </div>

          {/* Description */}
          <p className="text-body text-ink-soft leading-relaxed">{description}</p>
        </div>

        {/* Focus Areas */}
        {focusAreas && focusAreas.length > 0 && (
          <div className="space-y-2.5 border-t border-line/10 pt-4">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
              Scope of Representation
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-small text-ink-soft">
              {focusAreas.map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </LayeredSurface>
  );
}
