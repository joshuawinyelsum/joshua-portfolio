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
    title: 'Research → Build → Measure → Improve.',
    description:
      'I learn by turning questions into experiments, experiments into systems, and systems into useful products.',
  },
];

export function Philosophy() {
  return (
    <section className="py-24 md:py-32 section-padding">
      <div className="max-w-4xl">
        <SectionHeader title="How I Think About Building" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {principles.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 100}>
              <div className="border-t-2 border-gray-900 dark:border-[#ededeb] pt-6">
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-neutral-500 block mb-3">
                  {p.number}
                </span>
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-[#ededeb] mb-3 tracking-tight leading-snug">
                  {p.title}
                </h3>
                <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-relaxed">{p.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
