import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { FeaturedProject } from '../components/projects/FeaturedProject';
import { getPreviewKind } from '../components/projects/ProjectScreen';
import { deployedWork, projects } from '../data/projects';

export function SelectedWork() {
  // Software applications featured in Selected Work:
  // Lead is the active production system (Coach Prosper's World).
  // The gallery showcases CFSS, MasteryOS, and MABIA AI (3 per row).
  // AgriChem is featured in the dedicated Research & Data section.
  const featuredProjects = [...projects, ...deployedWork].filter(
    (p) => p.featured && p.id !== 'agrichem'
  );
  const [lead, ...gallery] = featuredProjects;

  return (
    <section id="work" className="section pb-24 sm:pb-28">
      <div className="container-content">
        <SectionHeader
          title="Selected Work"
          subtitle="Production platforms, systems engineering, and data pipelines."
          accent="data pipelines."
        />

        {lead && <FeaturedProject project={lead} />}

        {/* Captured projects: an attractive horizontal arrangement, 3 per row */}
        {gallery.length > 0 && (
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {gallery.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
