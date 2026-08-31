import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { education, credentials } from '../data/education';

export function Education() {
  return (
    <section className="py-24 md:py-32 section-padding bg-white">
      <div className="max-w-4xl">
        <SectionHeader title="Education & Credentials" />

        {/* Education */}
        {education.map((edu, index) => (
          <ScrollReveal key={edu.institution} delay={index * 100}>
            <div className="border-t border-gray-300/80 pt-8 pb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.institution}</h3>
              <p className="text-sm font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1">
                {edu.degree}
              </p>
              <p className="text-sm text-gray-500 mb-5">
                {edu.location} · {edu.status}
              </p>
              {edu.coursework && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-3">
                    Relevant Coursework
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((course) => (
                      <span
                        key={course}
                        className="px-3 py-1 text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}

        {/* Credentials */}
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
              Credentials
            </p>
            <div className="flex-1 h-px max-w-[40px] bg-gray-200" />
          </div>
          {credentials.map((cred, index) => (
            <ScrollReveal key={cred.title} delay={index * 80}>
              <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-gray-900">{cred.title}</h4>
                  <p className="text-sm text-gray-500">
                    {cred.issuer} · {cred.type}
                    {cred.year && ` · ${cred.year}`}
                  </p>
                </div>
                {cred.score && (
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    {cred.score}
                  </span>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
