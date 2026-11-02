import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';

export function SelectedWork() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="work" className="py-24 md:py-32 section-padding bg-white dark:bg-[#18191e]">
      <div className="max-w-5xl">
        <SectionHeader
          title="Selected Work"
          subtitle="Production platforms, systems engineering, and data pipelines."
        />
        <div>
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
