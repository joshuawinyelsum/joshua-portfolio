import { BuildingProject } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { StatusTag } from './ui/Tag';

interface BuildingCardProps {
  project: BuildingProject;
  index: number;
}

/**
 * One row in the Currently Building list. No surface of its own: hierarchy
 * comes from type and spacing, and the status tag carries the only colour.
 */
export function BuildingCard({ project, index }: BuildingCardProps) {
  return (
    <li className="h-full list-none">
      <ScrollReveal delay={index * 70} className="h-full">
        <div className="group flex h-full flex-col justify-between rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-6 sm:p-7 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-title font-bold text-ink tracking-tight group-hover:text-accent transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="mt-0.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
                  {project.subtitle}
                </p>
              </div>
              <StatusTag status={project.status} />
            </div>

            <p className="mt-3.5 text-small text-ink-soft leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-line/10 flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span>Verified System</span>
            <span className="text-accent font-semibold">Active Development</span>
          </div>
        </div>
      </ScrollReveal>
    </li>
  );
}
