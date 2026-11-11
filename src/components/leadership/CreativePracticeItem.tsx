import { Tag } from '../ui/Tag';
import type { CreativePracticeData } from '../../data/leadership';

interface CreativePracticeItemProps {
  practice: CreativePracticeData;
  index: number;
}

export function CreativePracticeItem({ practice }: CreativePracticeItemProps) {
  const { instrument, role, description, attributes } = practice;

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-6 sm:p-7 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="text-title font-bold text-ink tracking-tight">{instrument}</h4>
          <span className="font-mono text-xs font-semibold text-accent">4/4 TIME</span>
        </div>
        <p className="text-small font-semibold text-ink-soft">{role}</p>
        <p className="mt-2 text-body text-ink-soft leading-relaxed">{description}</p>
      </div>

      <div className="mt-5 border-t border-line/10 pt-3.5">
        <ul className="flex flex-wrap gap-1.5">
          {attributes.map((attr) => (
            <li key={attr}>
              <Tag>{attr}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
