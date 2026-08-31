import { SectionHeader } from '../components/SectionHeader';
import { BuildingCard } from '../components/BuildingCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { currentlyBuilding, currentlyLearning } from '../data/currentlyBuilding';

export function CurrentlyBuilding() {
  return (
    <section id="building" className="py-24 md:py-32 section-padding bg-white">
      <div className="max-w-5xl">
        <SectionHeader
          title="Currently Building"
          subtitle={`"The work doesn't stop when a project ships."`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {currentlyBuilding.map((project, index) => (
            <BuildingCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <ScrollReveal>
          <div className="border-t border-gray-200 pt-12">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
                Currently Learning
              </h3>
              <div className="flex-1 h-px max-w-[40px] bg-gray-200" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {currentlyLearning.map((item, i) => (
                <ScrollReveal key={item} delay={i * 40}>
                  <span className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-300">
                    {item}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
