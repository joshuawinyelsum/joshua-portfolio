import { SectionHeader } from '../components/SectionHeader';
import { BuildingCard } from '../components/BuildingCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { Tag } from '../components/ui/Tag';
import { currentlyBuilding, currentlyLearning } from '../data/currentlyBuilding';

export function CurrentlyBuilding() {
  return (
    <section id="building" className="section">
      <div className="container-content">
        <SectionHeader
          title="Currently Building"
          subtitle={`"The work doesn't stop when a project ships."`}
          accent="a project ships."
        />

        <ul className="rows">
          {currentlyBuilding.map((project, index) => (
            <BuildingCard key={project.title} project={project} index={index} />
          ))}
        </ul>

        <ScrollReveal className="mt-12">
          <h3 className="text-small font-semibold text-ink">Currently Learning</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {currentlyLearning.map((item) => (
              <li key={item}>
                <Tag className="tag--lg">{item}</Tag>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
