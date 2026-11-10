import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { Tag } from '../components/ui/Tag';
import { education } from '../data/education';

export function Education() {
  return (
    <section className="section">
      <div className="container-content">
        <SectionHeader title="Education" />

        <div className="space-y-12">
          {education.map((edu, index) => (
            <ScrollReveal
              key={edu.institution}
              delay={index * 100}
              className="grid items-start gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
            >
              <div>
                <h3 className="text-title-lg font-bold text-ink">{edu.institution}</h3>
                <p className="mt-2 text-body font-medium text-accent">{edu.degree}</p>
                <p className="mt-1 text-small text-ink-muted">
                  {edu.location} · {edu.status}
                </p>
              </div>

              {edu.coursework && (
                <div className="lg:pt-2">
                  <p className="text-eyebrow font-semibold uppercase text-ink-muted">Relevant Coursework</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {edu.coursework.map((course) => (
                      <li key={course}>
                        <Tag>{course}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
