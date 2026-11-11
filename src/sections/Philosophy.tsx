import { ScrollReveal } from '../components/ScrollReveal';
import { SectionHeader } from '../components/SectionHeader';

const principles = [
  {
    number: '01',
    title: 'Build for Reality.',
    description:
      "Real systems have unreliable networks, messy data, changing requirements, limited resources, and users who don't behave like test cases.",
  },
  {
    number: '02',
    title: 'Understand the Problem First.',
    description:
      'Technology is a means, not the starting point. I want to understand the problem before deciding what to build.',
  },
  {
    number: '03',
    title: 'Research · Build · Measure · Improve.',
    description:
      'I learn by turning questions into experiments, experiments into systems, and systems into useful products.',
  },
];

export function Philosophy() {
  return (
    <section className="section pb-24 sm:pb-28">
      <div className="container-content">
        <SectionHeader
          title="Engineering Philosophy"
          subtitle="Foundational principles guiding systems architecture and software design."
          accent="software design."
        />

        <div className="grid gap-7 md:grid-cols-3">
          {principles.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 90} className="h-full">
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-brand-charcoal/[0.08] bg-surface p-7 sm:p-8 transition-all duration-300 hover:border-brand-lavender/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                      {p.number} /
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cream" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-title font-bold text-ink tracking-tight group-hover:text-accent transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-body text-ink-soft leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/10">
                  <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider">
                    Core Invariant
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
