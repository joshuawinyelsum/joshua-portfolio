import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';

const stages = [
  'Software Engineering Foundations',
  'Backend & Application Architecture',
  'Database Systems & Relational Modeling',
  'Offline-First & Resilient Systems',
  'Data Pipelines & Validation Infrastructure',
  'Applied AI & Machine Learning Systems',
];

export function CareerDirection() {
  return (
    <section className="section pb-24 sm:pb-28">
      <div className="container-content">
        <SectionHeader title="Technical Progression" />

        <div className="grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <ol className="rows">
            {stages.map((stage, i) => {
              const isLast = i === stages.length - 1;

              return (
                <li key={stage}>
                  <ScrollReveal delay={i * 60} className="flex items-baseline gap-5 py-4">
                    <span className="text-small font-semibold tabular-nums text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-body ${isLast ? 'font-bold text-ink' : 'font-medium text-ink-soft'}`}>
                      {stage}
                    </span>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>

          <ScrollReveal delay={200}>
            <p className="max-w-md text-lead text-ink-soft lg:pt-4">
              Progressing systematically from robust backend architectures and relational data modeling toward resilient distributed systems, data pipelines, and applied AI.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
