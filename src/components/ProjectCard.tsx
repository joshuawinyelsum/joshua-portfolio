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
      <article className="group flex h-full flex-col min-w-0">
        {hasPreview && (
          <div className="mb-6 min-w-0 overflow-hidden">
            <ProjectScreen project={project} />
          </div>
        )}

        {!hasPreview && <p className="mb-3 text-eyebrow font-semibold uppercase text-ink-muted">{project.category}</p>}

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-title font-bold text-ink">{project.title}</h3>
          <StatusTag status={project.status} />
        </div>

        <p className="mt-2 line-clamp-3 max-w-xl text-small text-ink-soft">{project.summary}</p>

        {project.technologies.length > 0 && (
          <p className="mt-3 text-caption text-ink-muted">{project.technologies.slice(0, 4).join(' · ')}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-5">
          {hasCaseStudy ? (
            <ArrowLink to={project.ctaLink} aria-label={`${project.title}: ${project.cta}`}>
              {projectEvidence[project.id] ? 'Project Evidence' : 'Case Study'}
            </ArrowLink>
          ) : (
            <ArrowLink href={project.ctaLink} external>
              {project.cta}
            </ArrowLink>
          )}
          <PreviewNote project={project} />
        </div>
      </article>
    </ScrollReveal>
  );
}
