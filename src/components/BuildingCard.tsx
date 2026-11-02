import { BuildingProject, ProjectStatus } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface BuildingCardProps {
  project: BuildingProject;
  index: number;
}

const statusStyles: Record<ProjectStatus, string> = {
  LIVE: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
  BUILT: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
  'IN PROGRESS': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
  RESEARCH: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60',
  PLANNED: 'bg-gray-100 dark:bg-neutral-900/50 text-gray-600 dark:text-neutral-400 border-gray-200 dark:border-neutral-800',
};

export function BuildingCard({ project, index }: BuildingCardProps) {
  const statusClass = statusStyles[project.status] || statusStyles['IN PROGRESS'];

  return (
    <ScrollReveal delay={index * 70}>
      <div className="group relative p-6 bg-white dark:bg-[#1c1e24] border border-gray-200/80 dark:border-[#282a32] rounded-lg transition-all duration-500 hover:border-gray-400/60 dark:hover:border-neutral-600 hover:shadow-sm">
        {/* Subtle left accent */}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-[#282a32] rounded-full transition-colors duration-500 group-hover:bg-gray-400 dark:group-hover:bg-neutral-500" />

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-[#ededeb] tracking-tight leading-snug pr-3">
            {project.title}
          </h3>
          <span
            className={`text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${statusClass}`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-400 dark:text-neutral-500 mb-3">
          {project.subtitle}
        </p>
        <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-relaxed">
          {project.description}
        </p>
      </div>
    </ScrollReveal>
  );
}
