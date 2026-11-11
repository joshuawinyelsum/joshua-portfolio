import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { Tag } from '../components/ui/Tag';
import { education } from '../data/education';

export function Education() {
  return (
    <section id="education" className="section pb-24 sm:pb-28">
      <div className="container-content">
        <SectionHeader
          title="Education"
          subtitle="Formal academic foundations in systems analysis and computer science."
          accent="computer science."
        />

        <div className="space-y-12">
          {education.map((edu, index) => (
            <ScrollReveal
              key={edu.institution}
              delay={index * 100}
              className="rounded-3xl border border-brand-charcoal/[0.08] bg-surface p-7 sm:p-9 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-brand-lavender/30 transition-all duration-300"
            >
              <div className="grid items-start gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
                <div>
                  <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accent">
                    Undergraduate Degree Program
                  </p>
                  <h3 className="mt-2 text-title-lg font-bold text-ink tracking-tight">{edu.institution}</h3>
                  <p className="mt-1 text-body font-semibold text-ink-soft">{edu.degree}</p>
                  <p className="mt-1 text-small text-ink-muted">
                    {edu.location} · {edu.currentLevel ? `${edu.currentLevel} · ` : ''}{edu.status}
                  </p>

                  {edu.gpa && (
                    <div className="mt-6 inline-flex flex-wrap items-center gap-3.5 rounded-xl border border-brand-charcoal/10 bg-brand-cream/35 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                        <span className="font-mono text-base font-bold text-brand-charcoal tracking-tight">
                          {edu.gpa}
                        </span>
                      </div>
                      <span className="hidden h-3.5 w-px bg-brand-charcoal/20 sm:block" aria-hidden="true" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                        5.00 Scale · Level 200
                      </span>
                    </div>
                  )}
                </div>

                {edu.coursework && (
                  <div className="lg:border-l lg:border-line/10 lg:pl-10">
                    <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                      Verified Relevant Coursework
                    </p>
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {edu.coursework.map((course, i) => (
                        <li
                          key={course}
                          className="flex items-center gap-2.5 rounded-lg border border-line/10 bg-surface-alt/60 px-3 py-2 text-small text-ink-soft transition-colors hover:border-brand-lavender/30 hover:text-ink"
                        >
                          <span className="font-mono text-[11px] font-semibold text-accent">
                            0{i + 1}
                          </span>
                          <span className="font-medium text-xs truncate">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
