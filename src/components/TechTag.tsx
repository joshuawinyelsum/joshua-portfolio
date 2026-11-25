import { Braces } from 'lucide-react';

interface TechTagProps {
  name: string;
  isActive?: boolean;
  isSubdued?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/** Interactive technology label used by the Engineering Stack explorer. */
export function TechTag({ name, isActive = false, isSubdued = false, onClick, onMouseEnter, onMouseLeave }: TechTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-pressed={isActive}
      className={`tag tag--lg ${isActive ? 'tag--active' : ''} ${
        isSubdued ? 'tag--subdued' : ''
      }`}
    >
      {name === 'Visual Basic .NET (VB.NET)' && (
        <Braces className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      )}
      <span>{name}</span>
    </button>
  );
}
