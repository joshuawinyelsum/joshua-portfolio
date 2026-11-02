import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusBadgeStyles: Record<ProjectStatus, { bg: string; text: string; border: string; dot?: string }> = {
  LIVE: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  BUILT: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  'IN PROGRESS': {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  RESEARCH: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/60',
    dot: 'bg-purple-500 dark:bg-purple-400',
  },
  PLANNED: {
    bg: 'bg-gray-50 dark:bg-neutral-900/50',
    text: 'text-gray-600 dark:text-neutral-400',
    border: 'border-gray-200 dark:border-neutral-800',
  },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const badge = statusBadgeStyles[project.status] || statusBadgeStyles.BUILT;

  return (
    <ScrollReveal delay={index * 120}>
      <Link
        to={project.ctaLink}
        className="group block py-10 md:py-12 border-t border-gray-300/80 dark:border-[#282a32] transition-all duration-500 hover:border-gray-500 dark:hover:border-neutral-500"
      >
        <div className="flex flex-col gap-6">
          {/* Top row: number + category + status badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-neutral-500">
                {project.number}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-neutral-500 hidden sm:inline">
                {project.category}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {badge.dot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${
                    project.status === 'LIVE' ? 'animate-pulse' : ''
                  }`}
                />
              )}
              {project.status}
            </span>
          </div>

          {/* Title + Subtitle */}
          <div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-[#ededeb] tracking-tighter break-words mb-2 transition-all duration-500 group-hover:translate-x-1 group-hover:text-gray-800 dark:group-hover:text-white">
              {project.title}
            </h3>
            <p className="text-sm font-medium tracking-[0.12em] uppercase text-gray-500 dark:text-neutral-400">
              {project.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-[15px] text-gray-600 dark:text-neutral-300 max-w-2xl leading-[1.75]">
            {project.description}
          </p>

          {/* Bottom row: tech + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-white/80 dark:bg-[#1c1e24] border border-gray-200/80 dark:border-[#282a32] rounded text-gray-500 dark:text-neutral-400 transition-colors duration-300 group-hover:border-gray-300 dark:group-hover:border-neutral-600"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wide bg-white/80 dark:bg-[#1c1e24] border border-gray-200/80 dark:border-[#282a32] rounded text-gray-400 dark:text-neutral-500">
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-[#ededeb] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 shrink-0">
              {project.cta}
              <svg
                className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
