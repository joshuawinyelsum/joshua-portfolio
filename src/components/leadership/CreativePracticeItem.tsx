import { Tag } from '../ui/Tag';
import type { CreativePracticeData } from '../../data/leadership';

interface CreativePracticeItemProps {
  practice: CreativePracticeData;
  index: number;
}

export function CreativePracticeItem({ practice }: CreativePracticeItemProps) {
  const { instrument, role, description, attributes } = practice;

  return (
    <article className="py-2">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="text-title font-bold text-ink">{instrument}</h4>
          <span className="font-mono text-xs text-ink-muted">4/4</span>
        </div>
        <p className="text-small font-medium text-accent">{role}</p>
        <p className="text-body text-ink-soft leading-relaxed">{description}</p>
      </div>

      <div className="mt-4 border-t border-line/10 pt-3">
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
