import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { projects } from '../data/projects';
import { ScrollReveal } from '../components/ScrollReveal';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Footer } from '../sections/Footer';

const cfssArchitecture = [
  { layer: 'Student / Field Worker', desc: 'User in the field collecting data', icon: '👤' },
  { layer: 'React Frontend', desc: 'Progressive web interface with forms & GPS', icon: '⚛' },
  { layer: 'IndexedDB / Offline Storage', desc: 'Local data persistence for offline-first', icon: '💾' },
  { layer: 'Synchronization Layer', desc: 'Handles data sync when connectivity returns', icon: '🔄' },
  { layer: 'FastAPI Backend', desc: 'API server handling auth, validation, and data', icon: '⚡' },
  { layer: 'Database', desc: 'Persistent storage for all survey data', icon: '🗄' },
];

const cfssContribution = [
  'Designed the offline-first data collection architecture',
  'Built the synchronization layer between IndexedDB and the backend',
  'Implemented GPS/location tracking and boundary calculations',
  'Created the student and admin workflow interfaces',
  'Developed duplicate-location detection logic',
];

const cfssLessons = [
  'Offline-first architecture requires careful consideration of data conflicts and sync ordering.',
  'GPS accuracy varies dramatically by device and environment — defensive engineering is essential.',
  'Systems designed for thousands of users require different thinking than single-user tools.',
  'Field conditions expose assumptions that lab environments never reveal.',
];

function ArchitectureDiagram() {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="my-10">
      {cfssArchitecture.map((item, i) => (
        <div key={item.layer} className="flex items-start gap-5 mb-0.5">
          <div className="flex flex-col items-center">
            {/* Node */}
            <div
              className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm"
              style={{
                borderColor: isInView ? '#111111' : '#D1D5DB',
                backgroundColor: isInView ? '#F9FAFB' : 'transparent',
                transform: isInView ? 'scale(1)' : 'scale(0.8)',
                transition: reducedMotion
                  ? 'none'
                  : `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
              }}
            >
              <span
                style={{
                  opacity: isInView ? 1 : 0,
                  transition: reducedMotion ? 'none' : `opacity 0.4s ease ${i * 120 + 200}ms`,
                }}
              >
                {item.icon}
              </span>
            </div>
            {/* Connector */}
            {i < cfssArchitecture.length - 1 && (
              <div
                className="w-px h-6 origin-top"
                style={{
                  backgroundColor: isInView ? '#111111' : '#D1D5DB',
                  transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
                  transition: reducedMotion
                    ? 'none'
                    : `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120 + 80}ms, background-color 0.4s ease ${i * 120}ms`,
                }}
              />
            )}
          </div>
          {/* Label */}
          <div
            className="pb-4 pt-1.5"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'none' : 'translateX(12px)',
              transition: reducedMotion
                ? 'none'
                : `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
            }}
          >
            <p className="text-[15px] font-bold text-gray-900">{item.layer}</p>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudy() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isCFSS = project.id === 'cfss';
  let sectionNum = 0;
  const nextSection = () => String(++sectionNum).padStart(2, '0');

  return (
    <>
      <main className="pt-28 pb-20">
        <article>
          {/* Header */}
          <section className="section-padding mb-16">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-10"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to home
            </Link>

            <ScrollReveal>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 block mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tighter mb-3">
                {project.title}
              </h1>
              <p className="text-lg md:text-xl font-medium text-gray-500">
                {project.subtitle}
              </p>
            </ScrollReveal>
          </section>

          {/* Technologies */}
          <section className="section-padding mb-20">
            <ScrollReveal>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-[11px] font-semibold tracking-wide text-gray-600 bg-white border border-gray-200 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* Overview */}
          <section className="section-padding mb-20 max-w-3xl">
            <ScrollReveal>
              <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                {nextSection()} — Overview
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>
            </ScrollReveal>
          </section>

          {/* Problem */}
          {project.problem && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Problem
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.75]">{project.problem}</p>
              </ScrollReveal>
            </section>
          )}

          {/* System */}
          {project.system && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — System
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.75]">{project.system}</p>
              </ScrollReveal>
            </section>
          )}

          {/* Architecture (CFSS only) */}
          {isCFSS && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Architecture
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Data flows from the field through offline storage, synchronization, and into the
                  backend.
                </p>
              </ScrollReveal>
              <ArchitectureDiagram />
            </section>
          )}

          {/* Capabilities */}
          {project.capabilities && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Key Capabilities
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2.5 text-[15px] text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </section>
          )}

          {/* My Contribution (CFSS only) */}
          {isCFSS && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — My Contribution
                </h2>
                <ul className="space-y-3">
                  {cfssContribution.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </section>
          )}

          {/* Scale statement */}
          {project.scaleStatement && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <div className="border-l-2 border-gray-900 pl-6 py-2">
                  <p className="text-lg font-semibold text-gray-800 italic leading-relaxed">
                    {project.scaleStatement}
                  </p>
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Lessons Learned (CFSS only) */}
          {isCFSS && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Lessons Learned
                </h2>
                <ul className="space-y-4">
                  {cfssLessons.map((lesson, i) => (
                    <ScrollReveal key={i} delay={i * 80}>
                      <li className="flex items-start gap-3 text-[15px] text-gray-600 leading-[1.75]">
                        <span className="text-[10px] font-bold text-gray-400 mt-1 tabular-nums shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {lesson}
                      </li>
                    </ScrollReveal>
                  ))}
                </ul>
              </ScrollReveal>
            </section>
          )}

          {/* Back link */}
          <section className="section-padding mb-16">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to all work
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
