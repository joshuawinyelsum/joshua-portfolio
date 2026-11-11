import { Music, Radio } from 'lucide-react';
import { LayeredSurface } from '../ui/LayeredSurface';
import type { CreativePracticeData } from '../../data/leadership';

interface CreativePracticeItemProps {
  practice: CreativePracticeData;
  index: number;
}

export function CreativePracticeItem({ practice, index }: CreativePracticeItemProps) {
  const { instrument, role, description, attributes } = practice;
  const isBass = practice.id === 'bass-guitar';
  const accent = isBass ? 'lavender' : 'cream';

  return (
    <LayeredSurface stack="offset" accent={accent} className="h-full">
      <div className="flex h-full flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Header & Musical Accent */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-accent" strokeWidth={2} aria-hidden="true" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                  Creative Practice
                </span>
              </div>
              <h4 className="mt-2 text-h3 font-extrabold text-ink tracking-tight">
                {instrument}
              </h4>
            </div>

            {/* Stylized Rhythmic Time Signature Badge */}
            <div
              className="flex h-10 w-10 flex-col items-center justify-center rounded-control bg-sunken font-mono text-[11px] font-bold text-ink-muted select-none"
              title="Musical rhythm and timing discipline"
              aria-label="4/4 time signature indicator"
            >
              <span className="leading-none text-ink">4</span>
              <span className="h-[1px] w-4 bg-line my-0.5" />
              <span className="leading-none text-ink">4</span>
            </div>
          </div>

          {/* Role / Context */}
          <div className="border-t border-line/10 pt-3">
            <p className="text-small font-semibold text-ink-soft">
              {role}
            </p>
          </div>

          {/* Factual Description */}
          <p className="text-body text-ink-soft leading-relaxed">
            {description}
          </p>
        </div>

        {/* Disciplines & Attributes */}
        <div className="space-y-2.5 border-t border-line/10 pt-4">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
            Musical Practice & Discipline
          </p>
          <div className="flex flex-wrap gap-2">
            {attributes.map((attr) => (
              <span
                key={attr}
                className="inline-flex items-center gap-1.5 rounded-control bg-sunken px-2.5 py-1 text-xs font-medium text-ink-soft"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isBass ? 'bg-accent' : 'bg-cream'}`}
                  aria-hidden="true"
                />
                <span>{attr}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </LayeredSurface>
  );
}
