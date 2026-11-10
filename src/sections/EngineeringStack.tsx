import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { TechTag } from '../components/TechTag';
import { LayeredSurface } from '../components/ui/LayeredSurface';
import { Tag } from '../components/ui/Tag';
import { skills, skillCategories } from '../data/skills';
import { projects } from '../data/projects';

export function EngineeringStack() {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const activeSkill = activeTech ? skills.find((s) => s.name === activeTech) : null;
  const linkedProjectIds = activeSkill?.linkedProjects || [];

  return (
    <section id="stack" className="section">
      <div className="container-content">
        <SectionHeader title="Engineering Stack" subtitle="Technologies behind the work." accent="the work." />

        <div className="grid gap-x-grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, catIndex) => (
            <ScrollReveal key={category} delay={catIndex * 60}>
              <h3 className="text-small font-semibold text-ink">{category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => {
                    const isActive = activeTech === skill.name;

                    return (
                      <TechTag
                        key={skill.name}
                        name={skill.name}
                        isActive={isActive}
                        isSubdued={activeTech !== null && !isActive}
                        onMouseEnter={() => setActiveTech(skill.name)}
                        onMouseLeave={() => setActiveTech(null)}
                        onClick={() => setActiveTech(isActive ? null : skill.name)}
                      />
                    );
                  })}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Connected projects. Always present so the page never jumps. */}
        <ScrollReveal className="mt-12">
          <LayeredSurface stack="none" tone="sunken" faceClassName="min-h-[6.5rem] p-card" aria-live="polite">
            <p className="text-eyebrow font-semibold uppercase text-ink-muted">
              {activeTech ? `${activeTech} · Used in` : 'Used in'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeTech && linkedProjectIds.length > 0 ? (
                linkedProjectIds.map((id) => {
                  const project = projects.find((p) => p.id === id);
                  if (!project) return null;
                  return (
                    <Tag key={id} tone="surface" className="tag--lg">
                      <span className="font-semibold text-ink">{project.title}</span>
                      <span className="hidden text-ink-muted sm:inline">{project.subtitle}</span>
                    </Tag>
                  );
                })
              ) : (
                <p className="text-small text-ink-muted">Hover or tap a technology to see the projects built with it.</p>
              )}
            </div>
          </LayeredSurface>
        </ScrollReveal>
      </div>
    </section>
  );
}
