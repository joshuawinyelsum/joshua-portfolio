import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const stages = [
  'Software Engineering Foundations',
  'Backend & Application Architecture',
  'Database Systems & Relational Modeling',
  'Offline-First & Resilient Systems',
  'Data Pipelines & Validation Infrastructure',
  'Applied AI & Machine Learning Systems',
];

export function CareerDirection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32 section-padding">
      <div className="max-w-3xl">
        <SectionHeader title="Technical Progression" />

        <div ref={ref} className="mb-12">
          {stages.map((stage, i) => {
            const isLast = i === stages.length - 1;
            return (
              <div key={stage} className="relative pl-10 pb-1">
                {/* Line */}
                {!isLast && (
                  <div
                    className="absolute left-[7px] top-5 h-8 w-px bg-gray-300 origin-top"
                    style={{
                      transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
                      transition: reducedMotion
                        ? 'none'
                        : `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100 + 100}ms`,
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  className="absolute left-0 top-2"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'scale(1)' : 'scale(0.5)',
                    transition: reducedMotion
                      ? 'none'
                      : `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
                  }}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      isLast
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-gray-400 border-gray-400'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`block pb-6 text-[15px] font-medium ${
                    isLast ? 'text-gray-900 font-bold' : 'text-gray-600'
                  }`}
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'none' : 'translateX(-8px)',
                    transition: reducedMotion
                      ? 'none'
                      : `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
                  }}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        <ScrollReveal delay={300}>
          <p className="text-[15px] text-gray-600 leading-[1.75] max-w-xl">
            Progressing systematically from robust backend architectures and relational data modeling toward resilient distributed systems, data pipelines, and applied AI.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
