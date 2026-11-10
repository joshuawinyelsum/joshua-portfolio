import type { ReactNode } from 'react';
import { ScrollReveal } from './ScrollReveal';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Part of the headline to set in the accent colour (must match exactly). */
  accent?: string;
  /** Optional content aligned to the right of the headline on wide screens. */
  aside?: ReactNode;
  align?: 'left' | 'center';
}

function withAccent(text: string, accent?: string) {
  if (!accent) return text;
  const index = text.indexOf(accent);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="text-accent">{accent}</span>
      {text.slice(index + accent.length)}
    </>
  );
}

/**
 * Section heading from the references: a dotted uppercase eyebrow above a
 * bold headline. Sections that only have a title use it as the headline.
 */
export function SectionHeader({ title, subtitle, accent, aside, align = 'left' }: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <ScrollReveal className="mb-12 md:mb-16">
      <div
        className={`flex flex-col gap-6 ${
          centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
        }`}
      >
        <div className="max-w-2xl">
          {subtitle ? (
            <>
              <h2 className="eyebrow">{title}</h2>
              <p className="mt-5 text-headline font-bold text-ink text-balance">{withAccent(subtitle, accent)}</p>
            </>
          ) : (
            <h2 className="text-headline font-bold text-ink text-balance">{withAccent(title, accent)}</h2>
          )}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </ScrollReveal>
  );
}
