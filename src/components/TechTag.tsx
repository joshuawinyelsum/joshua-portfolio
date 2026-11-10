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
      {name}
    </button>
  );
}
