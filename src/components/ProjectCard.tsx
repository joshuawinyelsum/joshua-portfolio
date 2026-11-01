import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusBadgeStyles: Record<ProjectStatus, { bg: string; text: string; border: string; dot?: string }> = {
  LIVE: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  BUILT: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  'IN PROGRESS': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  RESEARCH: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  PLANNED: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const badge = statusBadgeStyles[project.status] || statusBadgeStyles.BUILT;

  return (
    <ScrollReveal delay={index * 120}>
      <Link
        to={project.ctaLink}
        className="group block py-10 md:py-12 border-t border-gray-300/80 transition-all duration-500 hover:border-gray-500"
      >
        <div className="flex flex-col gap-6">
          {/* Top row: number + category + status badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">
                {project.number}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 hidden sm:inline">
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
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tighter mb-2 transition-all duration-500 group-hover:translate-x-1 group-hover:text-gray-800">
              {project.title}
            </h3>
            <p className="text-sm font-medium tracking-[0.12em] uppercase text-gray-500">
              {project.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-[15px] text-gray-600 max-w-2xl leading-[1.75]">
            {project.description}
          </p>

          {/* Bottom row: tech + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-white/80 border border-gray-200/80 rounded text-gray-500 transition-colors duration-300 group-hover:border-gray-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wide bg-white/80 border border-gray-200/80 rounded text-gray-400">
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 shrink-0">
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
