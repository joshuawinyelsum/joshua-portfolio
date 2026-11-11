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
    <section className="section">
      <div className="container-content">
        <SectionHeader title="How I Think About Building" />

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
          {principles.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 90}>
              <span className="text-title font-semibold text-accent">{p.number}.</span>
              <h3 className="mt-4 text-title font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-body text-ink-soft">{p.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
