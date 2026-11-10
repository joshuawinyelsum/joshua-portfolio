import type { ReactNode } from 'react';

interface ProjectPreviewProps {
  children: ReactNode;
  /** Sheets spread when the pointer is over the preview itself. */
  interactive?: boolean;
  /** Sheets spread when an ancestor with the `group` class is hovered. */
  follow?: boolean;
  className?: string;
}

/**
 * Layered presentation from the featured-project reference: a lavender sheet
 * up and to the left, a cream sheet down and to the right, content on top.
 * Used for project screenshots and the hero terminal.
 */
export function ProjectPreview({ children, interactive = false, follow = false, className = '' }: ProjectPreviewProps) {
  const classes = ['stack', interactive ? 'stack--interactive' : '', follow ? 'stack--follow' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className="stack__layer stack__layer--lavender" aria-hidden="true" />
      <span className="stack__layer stack__layer--cream" aria-hidden="true" />
      {children}
    </div>
  );
}
