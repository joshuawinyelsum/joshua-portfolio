import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { skills, skillCategories } from '../data/skills';
import { projects } from '../data/projects';

export function EngineeringStack() {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const activeSkill = activeTech ? skills.find((s) => s.name === activeTech) : null;
  const linkedProjectIds = activeSkill?.linkedProjects || [];

  return (
    <section id="stack" className="py-24 md:py-32 section-padding">
      <div className="max-w-5xl">
        <SectionHeader
          title="Engineering Stack"
          subtitle="Technologies behind the work."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {skillCategories.map((category, catIndex) => (
            <ScrollReveal key={category} delay={catIndex * 60}>
              <div>
                <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-4 pb-2 border-b border-gray-300/60">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => {
                      const isActive = activeTech === skill.name;
                      const isSubdued = activeTech !== null && !isActive;

                      return (
                        <button
                          key={skill.name}
                          onMouseEnter={() => setActiveTech(skill.name)}
                          onMouseLeave={() => setActiveTech(null)}
                          onClick={() =>
                            setActiveTech(activeTech === skill.name ? null : skill.name)
                          }
                          className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide rounded border transition-all duration-300 ${
                            isActive
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                              : isSubdued
                              ? 'bg-transparent text-gray-400 border-gray-200 opacity-40'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Connected projects panel */}
        <div
          className={`mt-10 overflow-hidden transition-all duration-500 ease-out ${
            activeTech && linkedProjectIds.length > 0
              ? 'max-h-40 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-3">
              {activeTech} → Used in
            </p>
            <div className="flex flex-wrap gap-3">
              {linkedProjectIds.map((id) => {
                const project = projects.find((p) => p.id === id);
                if (!project) return null;
                return (
                  <span
                    key={id}
                    className="px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {project.title}
                    <span className="text-gray-400 font-normal ml-1.5 text-xs">
                      {project.subtitle}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
