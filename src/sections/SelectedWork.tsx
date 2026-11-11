import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { FeaturedProject } from '../components/projects/FeaturedProject';
import { getPreviewKind } from '../components/projects/ProjectScreen';
import { deployedWork, projects } from '../data/projects';

export function SelectedWork() {
  const featuredProjects = [...projects, ...deployedWork].filter((p) => p.featured);
  const [lead, ...rest] = featuredProjects;

  // Projects with an authentic capture are shown in a browser window; the
  // others are listed as text until a real capture exists.
  const visual = rest.filter((p) => getPreviewKind(p) !== 'none');
  const textOnly = rest.filter((p) => getPreviewKind(p) === 'none');

  return (
    <section id="work" className="section">
      <div className="container-content">
        <SectionHeader
          title="Selected Work"
          subtitle="Production platforms, systems engineering, and data pipelines."
          accent="data pipelines."
        />

        {lead && <FeaturedProject project={lead} />}

        {/* Captured projects: an even gallery, up to three per row. */}
        {visual.length > 0 && (
          <div
            className={`mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2 ${visual.length >= 3 ? 'lg:grid-cols-3' : ''}`}
          >
            {visual.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Projects without a capture yet: compact text entries. */}
        {textOnly.length > 0 && (
          <div className="mt-16 grid gap-x-10 gap-y-12 border-t border-line/10 pt-12 md:grid-cols-2 lg:grid-cols-3">
            {textOnly.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={visual.length + index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
