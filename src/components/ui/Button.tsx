import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * The canonical button. Every button on the site is this component.
 *
 * Construction (see docs/DESIGN_REFERENCE_AUDIT.md, "bottom 1"):
 * a rounded-rectangle face with two separate backing sheets behind it,
 * lavender rising at the top-left and cream at the top-right. Geometry,
 * shadows and motion all come from the tokens consumed by `.btn`.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIcon = 'arrow' | 'diagonal' | 'none';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing arrow. `arrow` for in-page actions, `diagonal` for leaving the page. */
  icon?: ButtonIcon;
  /** Optional leading glyph (kept to functional icons such as print). */
  leading?: ReactNode;
  /** Fill the width of the container. */
  block?: boolean;
  /** Push label and arrow to opposite edges, as in the reference. */
  spread?: boolean;
  className?: string;
  /** Internal route. Renders a router link. */
  to?: string;
  /** External or hash link. Renders an anchor. */
  href?: string;
  external?: boolean;
  /** Download the linked file (same-origin files only); pass a filename to suggest one. */
  download?: boolean | string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = 'none',
  leading,
  block = false,
  spread = false,
  className = '',
  to,
  href,
  external = false,
  download,
  onClick,
  type = 'button',
  disabled = false,
  ...aria
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    block ? 'btn--block' : '',
    spread ? 'btn--spread' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {variant !== 'icon' && (
        <>
          <span className="btn__layer btn__layer--lavender" aria-hidden="true" />
          <span className="btn__layer btn__layer--cream" aria-hidden="true" />
        </>
      )}
      <span className="btn__face">
        {leading}
        {variant === 'icon' ? children : <span>{children}</span>}
        {icon === 'arrow' && (
          <ArrowRight className="btn__icon btn__icon--arrow" strokeWidth={1.75} aria-hidden="true" />
        )}
        {icon === 'diagonal' && (
          <ArrowUpRight className="btn__icon btn__icon--diagonal" strokeWidth={1.75} aria-hidden="true" />
        )}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...aria}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download } : {})}
        {...aria}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...aria}>
      {content}
    </button>
  );
}
