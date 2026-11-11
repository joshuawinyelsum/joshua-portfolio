import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface EvidenceLinkProps {
  label: string;
  url: string;
  isExternal?: boolean;
  className?: string;
}

export function EvidenceLink({ label, url, isExternal = false, className = '' }: EvidenceLinkProps) {
  const isHash = url.startsWith('#');
  const isInternalRoute = url.startsWith('/') && !url.startsWith('//');

  const baseClasses =
    'inline-flex items-center gap-1.5 text-small font-semibold text-ink transition-colors duration-fast hover:text-accent';

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${className}`}
      >
        <span>{label}</span>
        <ExternalLink className="h-3.5 w-3.5 text-ink-muted transition-transform duration-fast group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
      </a>
    );
  }

  if (isHash) {
    return (
      <a
        href={url}
        className={`${baseClasses} ${className}`}
      >
        <span>{label}</span>
        <ArrowRight className="h-3.5 w-3.5 text-accent transition-transform duration-fast group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
      </a>
    );
  }

  if (isInternalRoute) {
    return (
      <Link
        to={url}
        className={`${baseClasses} ${className}`}
      >
        <span>{label}</span>
        <ArrowRight className="h-3.5 w-3.5 text-accent transition-transform duration-fast group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <a href={url} className={`${baseClasses} ${className}`}>
      <span>{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-accent transition-transform duration-fast group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
