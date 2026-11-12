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
      <article className="group grid items-center gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-w-0">
        <div className="min-w-0">
          <ProjectScreen project={project} eager />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="eyebrow">Featured Project</p>
            <StatusTag status={project.status} />
          </div>

          <h3 className="mt-5 text-title-lg font-bold text-ink">{project.title}</h3>
          <p className="mt-3 line-clamp-3 max-w-md text-body text-ink-soft">{project.summary}</p>
          {project.technologies.length > 0 && (
            <p className="mt-4 text-small text-ink-muted">{project.technologies.slice(0, 4).join(' · ')}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button to={project.ctaLink} icon="arrow">
              {project.cta}
            </Button>
            {project.liveUrl && (
              <ArrowLink href={project.liveUrl} external>
                Open live site
              </ArrowLink>
            )}
          </div>

          <div className="mt-6">
            <PreviewNote project={project} />
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
