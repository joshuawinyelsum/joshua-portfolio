import { Project } from '../../types';
import { ScrollReveal } from '../ScrollReveal';
import { ArrowLink } from '../ui/ArrowLink';
import { Button } from '../ui/Button';
import { StatusTag } from '../ui/Tag';
import { PreviewNote, ProjectScreen } from './ProjectScreen';

/**
 * Featured project: the same browser window as the gallery, given more room
 * because it shows the running site. No panel and no backing shapes; the
 * extra space is the emphasis.
 */
export function FeaturedProject({ project }: { project: Project }) {
  return (
    <ScrollReveal className="min-w-0">
      <article className="group grid items-center gap-x-12 gap-y-8 rounded-3xl border border-brand-charcoal/[0.08] bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-brand-lavender/30 transition-all duration-300 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-w-0">
        <div className="min-w-0 overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.01]">
          <ProjectScreen project={project} eager />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="eyebrow">Featured Production System</p>
            <StatusTag status={project.status} />
          </div>

          <h3 className="mt-4 text-title-lg font-bold text-ink tracking-tight">{project.title}</h3>
          <p className="mt-3 line-clamp-3 max-w-md text-body text-ink-soft leading-relaxed">{project.summary}</p>
          {project.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded bg-surface-alt/80 px-2.5 py-1 font-mono text-xs font-medium text-ink-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button to={project.ctaLink} icon="arrow">
              {project.cta}
            </Button>
            {project.liveUrl && (
              <ArrowLink href={project.liveUrl} external className="font-semibold text-small">
                Open live site
              </ArrowLink>
            )}
          </div>

          <div className="mt-5">
            <PreviewNote project={project} />
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
