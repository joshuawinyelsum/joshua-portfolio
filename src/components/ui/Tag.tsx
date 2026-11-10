import type { ReactNode } from 'react';
import type { ProjectStatus } from '../../types';

export type TagTone = 'neutral' | 'lavender' | 'cream' | 'on-inverse' | 'surface';

interface TagProps {
  children: ReactNode;
  tone?: TagTone;
  className?: string;
  title?: string;
}

/** Small rounded-rectangle label. Not a pill. */
export function Tag({ children, tone = 'neutral', className = '', title }: TagProps) {
  return (
    <span className={`tag ${tone !== 'neutral' ? `tag--${tone}` : ''} ${className}`} title={title}>
      {children}
    </span>
  );
}

const statusTone: Record<ProjectStatus, { tone: TagTone; dot: string }> = {
  LIVE: { tone: 'neutral', dot: 'text-positive' },
  BUILT: { tone: 'neutral', dot: 'text-ink' },
  'IN PROGRESS': { tone: 'cream', dot: 'text-ink' },
  RESEARCH: { tone: 'lavender', dot: 'text-accent' },
  PLANNED: { tone: 'neutral', dot: 'text-ink-muted' },
};

interface StatusTagProps {
  status: ProjectStatus;
  /** Use on onyx surfaces. */
  onInverse?: boolean;
  /** Override the visible label while keeping the status colour. */
  label?: string;
}

export function StatusTag({ status, onInverse = false, label }: StatusTagProps) {
  const style = statusTone[status] ?? statusTone.BUILT;
  const tone = onInverse ? 'on-inverse' : style.tone;
  const dot = onInverse ? (status === 'LIVE' ? 'text-positive' : 'text-cream') : style.dot;

  return (
    <span className={`tag tag--status ${tone !== 'neutral' ? `tag--${tone}` : ''}`}>
      <span className={`tag__dot ${dot}`} aria-hidden="true" />
      {label ?? status}
    </span>
  );
}
