import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MacBrowserFrameProps {
  /** What the window shows: a live preview or a genuine screenshot. */
  children: ReactNode;
  /** Text in the address notch: the real host, or the product's name. */
  address: string;
  /** The real destination. When set, the address is a link that opens it. */
  href?: string;
  /** Width / height of the content, so each screenshot keeps its own proportions. */
  ratio?: number;
  className?: string;
}

/**
 * The one frame used for every project preview: a flat macOS-style browser
 * window. Red, yellow and green controls at the upper-left, and the address
 * in a shallow notch that is part of the bar. Where the project is publicly
 * deployed the address is clickable and carries a small external-link mark.
 */
export function MacBrowserFrame({ children, address, href, ratio, className = '' }: MacBrowserFrameProps) {
  return (
    <div className={`window min-w-0 max-w-full ${className}`}>
      <div className="window__bar">
        <span className="window__controls" aria-hidden="true">
          <span className="window__control window__control--close" />
          <span className="window__control window__control--minimize" />
          <span className="window__control window__control--zoom" />
        </span>
        <span className="window__centre">
          {href ? (
            <a
              className="window__address"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${address} in a new tab`}
            >
              <span>{address}</span>
              <ArrowUpRight strokeWidth={2} aria-hidden="true" />
            </a>
          ) : (
            <span className="window__address" aria-hidden="true">
              <span>{address}</span>
            </span>
          )}
        </span>
      </div>
      <div className="window__screen" style={ratio ? ({ '--window-ratio': String(ratio) } as CSSProperties) : undefined}>
        {children}
      </div>
    </div>
  );
}
