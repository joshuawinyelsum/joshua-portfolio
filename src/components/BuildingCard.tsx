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
    <li>
      <ScrollReveal
        delay={index * 60}
        className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)_8.5rem] md:items-baseline"
      >
        <div>
          <h3 className="text-title font-bold text-ink">{project.title}</h3>
          <p className="mt-1 text-small text-ink-muted">{project.subtitle}</p>
        </div>
        <p className="text-body text-ink-soft">{project.description}</p>
        <div className="md:justify-self-end">
          <StatusTag status={project.status} />
        </div>
      </ScrollReveal>
    </li>
  );
}
