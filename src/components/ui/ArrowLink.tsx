import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ArrowLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Use on onyx surfaces. */
  onInverse?: boolean;
  /** Arrow leads and points back. */
  back?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * The text action from the reference cards ("Read more", "Case Study").
 * Renders a plain span when no destination is given, so it can sit inside a
 * surface that is itself the link.
 */
export function ArrowLink({
  children,
  to,
  href,
  external = false,
  onClick,
  onInverse = false,
  back = false,
  className = '',
  ...aria
}: ArrowLinkProps) {
  const classes = [
    'arrow-link',
    onInverse ? 'arrow-link--on-inverse' : '',
    back ? 'arrow-link--back' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const arrow = <ArrowRight strokeWidth={1.75} aria-hidden="true" />;
  const content = back ? (
    <>
      {arrow}
      {children}
    </>
  ) : (
    <>
      {children}
      {arrow}
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
        {...aria}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} {...aria}>
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
