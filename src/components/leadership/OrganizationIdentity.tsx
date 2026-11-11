import { Tag } from '../ui/Tag';

interface OrganizationIdentityProps {
  name: string;
  badge?: string;
  badgeTone?: 'lavender' | 'cream' | 'onyx';
  institution?: string;
  programme?: string;
  className?: string;
}

export function OrganizationIdentity({
  name,
  badge,
  badgeTone = 'cream',
  institution,
  programme,
  className = '',
}: OrganizationIdentityProps) {
  const tagTone = badgeTone === 'lavender' ? 'lavender' : badgeTone === 'cream' ? 'cream' : 'neutral';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="text-h3 font-bold text-ink tracking-tight">{name}</h3>
        {badge && (
          <Tag tone={tagTone} className="font-mono text-[11px] font-semibold uppercase tracking-wider">
            {badge}
          </Tag>
        )}
      </div>

      {(programme || institution) && (
        <p className="text-small font-medium text-ink-muted">
          {programme && <span className="text-ink-soft font-semibold">{programme}</span>}
          {programme && institution && <span className="mx-1.5 text-line">·</span>}
          {institution && <span>{institution}</span>}
        </p>
      )}
    </div>
  );
}
