import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { researchAreas, researchSources } from '../data/research';

export function Research() {
  return (
    <section id="research" className="py-28 md:py-36 section-padding bg-[#1A1A1A] text-white">
      <div className="max-w-5xl">
        <SectionHeader
          title="Research & Data"
          subtitle={`"Researching the gaps between data and reality."`}
          dark
        />

        {/* Featured research */}
        <ScrollReveal>
          <div className="mb-20">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 mb-4">
              Featured Research
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
              Ghana Agricultural-Chemical Data Landscape
            </h3>
            <p className="text-[15px] text-gray-400 leading-[1.75] max-w-2xl">
              A research investigation into Ghana's agricultural-chemical data ecosystem, focusing on
              how information is distributed, represented, validated, and connected across different
              sources.
            </p>
          </div>
        </ScrollReveal>

        {/* Research areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {researchAreas.map((area, index) => (
            <ScrollReveal key={area.title} delay={index * 60}>
              <div className="group p-5 border border-gray-800 rounded-lg hover:border-gray-600 transition-all duration-500">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[10px] font-bold text-gray-600 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {area.title}
                  </h4>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pl-7">
                  {area.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Data flow visualization */}
        <ScrollReveal>
          <div className="mb-20">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 mb-8">
              Research Pipeline
            </p>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {['Data Sources', 'Datasets', 'Schema', 'Canonical Structure', 'Usable Data'].map(
                (step, i) => (
                  <ScrollReveal key={step} delay={i * 100} direction="left">
                    <span className="flex items-center gap-2 md:gap-3">
                      <span className="px-3 py-2 border border-gray-700 rounded text-gray-300 text-xs font-medium hover:border-gray-500 hover:text-white transition-colors duration-300">
                        {step}
                      </span>
                      {i < 4 && (
                        <svg
                          className="w-4 h-4 text-gray-700 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      )}
                    </span>
                  </ScrollReveal>
                )
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Sources investigated */}
        <ScrollReveal>
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 mb-5">
              Sources Investigated
            </p>
            <div className="flex flex-wrap gap-2">
              {researchSources.map((source, i) => (
                <ScrollReveal key={source.abbreviation || source.name} delay={i * 40}>
                  <span
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-800 rounded-full hover:text-gray-200 hover:border-gray-600 transition-all duration-300 cursor-default"
                    title={source.name}
                  >
                    {source.abbreviation || source.name}
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
