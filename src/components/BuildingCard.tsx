import { BuildingProject } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface BuildingCardProps {
  project: BuildingProject;
  index: number;
}

const statusStyles: Record<string, string> = {
  BUILDING: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'RESEARCH / BUILDING': 'bg-violet-50 text-violet-700 border-violet-200',
  RESEARCH: 'bg-blue-50 text-blue-700 border-blue-200',
  EXPLORING: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function BuildingCard({ project, index }: BuildingCardProps) {
  const statusClass = statusStyles[project.status] || statusStyles.BUILDING;

  return (
    <ScrollReveal delay={index * 70}>
      <div className="group relative p-6 bg-white border border-gray-200/80 rounded-lg transition-all duration-500 hover:border-gray-400/60 hover:shadow-sm">
        {/* Subtle left accent */}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gray-200 rounded-full transition-colors duration-500 group-hover:bg-gray-400" />

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug pr-3">
            {project.title}
          </h3>
          <span
            className={`text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${statusClass}`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">
          {project.subtitle}
        </p>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          {project.description}
        </p>
      </div>
    </ScrollReveal>
  );
}
