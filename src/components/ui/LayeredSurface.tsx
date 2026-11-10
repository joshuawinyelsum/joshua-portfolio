import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/**
 * The canonical layered information box.
 *
 * A borderless face with separate backing sheets behind it. Two approved
 * constructions come from the references:
 *   crown  - lavender top-left and cream top-right rising above the face
 *   offset - one sheet the size of the face, shifted down and right
 * `none` gives the same face (radius, shadow) with no sheets, for dense
 * groups where every item carrying layers would be noise.
 */

export type SurfaceTone = 'paper' | 'inverse' | 'sunken';
export type SurfaceStack = 'crown' | 'offset' | 'none';

type LayeredSurfaceProps = Omit<ComponentPropsWithoutRef<'div'>, 'className'> & {
  children: ReactNode;
  as?: ElementType;
  tone?: SurfaceTone;
  stack?: SurfaceStack;
  /** Colour of the offset sheet. */
  accent?: 'lavender' | 'cream';
  /** Lifts on hover. Use when the whole surface is a link or control. */
  interactive?: boolean;
  /** Classes for the outer element (layout: grid span, height). */
  className?: string;
  /** Classes for the face (padding, inner layout). Defaults to card padding. */
  faceClassName?: string;
  /** Link props when `as` is an anchor or router link. */
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
};

export function LayeredSurface({
  children,
  as: Component = 'div',
  tone = 'paper',
  stack = 'crown',
  accent = 'lavender',
  interactive = false,
  className = '',
  faceClassName = 'p-card',
  ...rest
}: LayeredSurfaceProps) {
  const classes = [
    'surface',
    tone !== 'paper' ? `surface--${tone}` : '',
    stack !== 'none' ? `surface--${stack}` : '',
    accent === 'cream' ? 'surface--accent-cream' : '',
    interactive ? 'surface--interactive group' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      {stack !== 'none' && <span className="surface__layer surface__layer--a" aria-hidden="true" />}
      {stack === 'crown' && <span className="surface__layer surface__layer--b" aria-hidden="true" />}
      <div className={`surface__face ${faceClassName}`}>{children}</div>
    </Component>
  );
}
