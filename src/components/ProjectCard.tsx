import { Project } from '../types';
import { projectEvidence } from '../data/projectEvidence';
import { ScrollReveal } from './ScrollReveal';
import { ArrowLink } from './ui/ArrowLink';
import { StatusTag } from './ui/Tag';
import { PreviewNote, ProjectScreen, getPreviewKind } from './projects/ProjectScreen';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * Gallery item. No card, no backing shapes: the browser window showing the
 * real software, then the name, up to three short lines, a compact
 * technology line where the stack is known, and one action.
 *
 * A project with no authentic capture (or no interface at all) is shown as
 * text only. It never gets an empty or invented screen.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const hasPreview = getPreviewKind(project) !== 'none';
  const hasCaseStudy = project.hasCaseStudy !== false;

  return (
    <ScrollReveal delay={index * 90} className="h-full min-w-0">
      <article className="group flex h-full flex-col min-w-0 rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
        {hasPreview && (
          <div className="mb-5 min-w-0 overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.015]">
            <ProjectScreen project={project} />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted truncate">
            {project.category}
          </p>
          <StatusTag status={project.status} />
        </div>

        <h3 className="mt-2 text-title font-bold text-ink tracking-tight group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-small text-ink-soft leading-relaxed">
          {project.summary}
        </p>

        {project.technologies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-line/10 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded bg-surface-alt/70 px-2 py-0.5 font-mono text-[11px] font-medium text-ink-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-5">
          {hasCaseStudy ? (
            <ArrowLink to={project.ctaLink} aria-label={`${project.title}: ${project.cta}`} className="font-semibold text-small">
              {projectEvidence[project.id] ? 'Project Evidence' : 'Case Study'}
            </ArrowLink>
          ) : (
            <ArrowLink href={project.ctaLink} external className="font-semibold text-small">
              {project.cta}
            </ArrowLink>
          )}
          <PreviewNote project={project} />
        </div>
      </article>
    </ScrollReveal>
  );
}
