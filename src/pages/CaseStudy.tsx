import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { projects } from '../data/projects';
import { ScrollReveal } from '../components/ScrollReveal';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Footer } from '../sections/Footer';

// CFSS Architecture data
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

// Coach Prosper's World Architecture data
const cpwArchitecture = [
  { layer: 'Next.js 16 App Router', desc: 'Full-stack SSR/SSG client and server route endpoints', icon: '▲' },
  { layer: 'NextAuth Security Layer', desc: 'Role-based access control, session validation & audit logs', icon: '🛡' },
  { layer: 'Prisma ORM & PostgreSQL', desc: 'Relational data modeling across 12 operational domains', icon: '🗄' },
  { layer: 'Dual-Tier Vercel Blob Storage', desc: 'Private store for applicant photos & public CMS media', icon: '☁' },
  { layer: 'Paystack Payment Gateway', desc: 'Donation initialization & HMAC-SHA512 webhook verification', icon: '💳' },
  { layer: 'Arkesel SMS Gateway', desc: 'Automated application SMS notifications & administrative broadcast', icon: '📱' },
];

const cpwContribution = [
  'Served as Software & Technology Lead, directing technical architecture and production readiness',
  'Engineered Next.js 16 full-stack architecture with TypeScript, Tailwind CSS v4, and PostgreSQL',
  'Designed a dual-tier Vercel Blob storage pipeline to strictly isolate confidential applicant records',
  'Implemented Paystack donation integration with cryptographic webhook signature verification',
  'Engineered Arkesel SMS messaging infrastructure for automated application alerts and admin messaging',
  'Built custom NextAuth authentication with role-based access control and admin security middleware',
  'Structured entity SEO with Schema.org JSON-LD (Organization/WebSite), dynamic sitemaps, and robots directives',
  'Developed automated integration and security test suites covering admin routes and webhook integrity',
];

const cpwDecisions = [
  {
    title: 'Confidential Applicant Storage Isolation',
    detail: 'To prevent accidental public indexing or URL enumeration of sensitive member application photos and documents, storage was partitioned into dedicated private and public Vercel Blob stores with authenticated route-scoped retrieval.',
  },
  {
    title: 'Cryptographic Payment Webhook Idempotency',
    detail: 'Donation webhooks from Paystack are verified using cryptographic HMAC-SHA512 signatures before updating donation records, ensuring protection against replay attacks and network retries.',
  },
  {
    title: 'Defensive Multi-Channel SMS Automation',
    detail: 'Applicant confirmation SMS triggers via Arkesel operate asynchronously with defensive status logging, preventing regional telecom network latencies from degrading the user submission experience.',
  },
  {
    title: 'Relational Integrity Across 12 Operational Domains',
    detail: 'Prisma ORM schemas were modeled for relational consistency across members, applications, donations, events, articles, comments, reactions, SMS history, templates, and audit logs.',
  },
];

const cpwWorkflows = [
  {
    title: 'Community Applications & Private Vault',
    desc: 'Prospective members apply through an intuitive multi-step form. Applicant documents and photos are streamed directly to an isolated private blob store, with admin-only authenticated access.',
  },
  {
    title: 'Paystack Voluntary Donations',
    desc: 'Donors contribute via mobile money and card rails. Transactions are verified in real time on the server with webhook event confirmation, maintaining an accurate ledger.',
  },
  {
    title: 'Automated SMS & Community Alerts',
    desc: 'Applicants receive instantaneous SMS confirmation. Leadership can broadcast announcements and program notifications directly to community phone numbers via Arkesel.',
  },
  {
    title: 'Role-Based Administrative Control',
    desc: 'Centralized admin operations for managing member statuses, application reviews, donation logs, content publishing, and security audit logs.',
  },
];

const cpwLessons = [
  'Applicant data protection must be architectural: physical storage separation is far more reliable than access flags on a shared bucket.',
  'Payment integrations require strict signature validation and idempotent processing to guard against webhook duplicates and race conditions.',
  'Third-party SMS gateways in developing regions require defensive timeout handling and status tracking to avoid blocking main web flows.',
  'Building for real organizations requires balancing rapid editorial CMS flexibility with robust access controls and data integrity.',
];

function ArchitectureDiagram({ items }: { items: { layer: string; desc: string; icon: string }[] }) {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="my-10">
      {items.map((item, i) => (
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
            {i < items.length - 1 && (
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

function BrowserPreview({ src, alt, liveUrl }: { src: string; alt: string; liveUrl?: string }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="my-10 rounded-xl overflow-hidden border border-gray-200/90 shadow-xl bg-[#0a120e] transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'none' : 'translateY(16px)',
        transition: reducedMotion ? 'none' : 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Browser chrome header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1d16] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        {liveUrl && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0a120e] border border-gray-700/60 text-[11px] font-mono text-gray-300 max-w-[280px] sm:max-w-sm truncate">
            <svg className="w-3 h-3 text-[#c7f25d] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="truncate">{liveUrl.replace('https://', '')}</span>
          </div>
        )}
        <div className="w-14 text-right">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-[#c7f25d] hover:underline"
            >
              Open ↗
            </a>
          )}
        </div>
      </div>
      {/* Screenshot */}
      <div className="bg-[#0a120e] relative aspect-[16/10] overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>
      <div className="px-5 py-3 bg-[#0f1d16] border-t border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-gray-400 font-mono">
        <span>Live Production Interface: coachprospersworld.org</span>
        <span className="text-[#c7f25d]">Active in Production</span>
      </div>
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
  const isCPW = project.id === 'coach-prospers-world';
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
              <p className="text-lg md:text-xl font-medium text-gray-500 mb-8">
                {project.subtitle}
              </p>

              {/* Action Links & Metadata Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider uppercase text-white bg-gray-900 hover:bg-black rounded-lg transition-colors shadow-sm"
                  >
                    Visit Live Website
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {isCPW && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg border border-gray-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Role: Software & Technology Lead
                  </span>
                )}
                {project.isPrivateRepo && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Source Code Private
                  </span>
                )}
              </div>
            </ScrollReveal>
          </section>

          {/* Genuine Browser Frame Visual Preview */}
          {isCPW && (
            <section className="section-padding mb-20 max-w-4xl">
              <ScrollReveal>
                <BrowserPreview
                  src="/images/projects/coach-prospers-world.png"
                  alt="Coach Prosper's World official production website interface"
                  liveUrl={project.liveUrl}
                />
              </ScrollReveal>
            </section>
          )}

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

          {/* Architecture (CFSS) */}
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
              <ArchitectureDiagram items={cfssArchitecture} />
            </section>
          )}

          {/* Architecture (Coach Prosper's World) */}
          {isCPW && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — System Architecture
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Full-stack architecture integrating role-based authentication, dual-tier blob storage, payment processing, and SMS automation.
                </p>
              </ScrollReveal>
              <ArchitectureDiagram items={cpwArchitecture} />
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

          {/* Core Workflows (Coach Prosper's World only) */}
          {isCPW && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Core Workflows & Integrations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cpwWorkflows.map((workflow, idx) => (
                    <div key={idx} className="p-5 rounded-lg border border-gray-200/80 bg-white">
                      <h3 className="text-base font-bold text-gray-900 mb-2">{workflow.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{workflow.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Engineering Decisions & Constraints (Coach Prosper's World only) */}
          {isCPW && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Engineering Decisions & Reliability
                </h2>
                <div className="space-y-6">
                  {cpwDecisions.map((decision, idx) => (
                    <div key={idx} className="border-l-2 border-gray-900 pl-5 py-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-1.5">
                        {decision.title}
                      </h3>
                      <p className="text-[15px] text-gray-600 leading-relaxed">
                        {decision.detail}
                      </p>
                    </div>
                  ))}
                </div>
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

          {/* My Role & Contribution (Coach Prosper's World only) */}
          {isCPW && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — My Role & Verified Contributions
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Serving as <strong>Software & Technology Lead</strong>, driving full-stack engineering, infrastructure hardening, and production deployment:
                </p>
                <ul className="space-y-3">
                  {cpwContribution.map((item) => (
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

          {/* Lessons Learned (CFSS) */}
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

          {/* Lessons Learned (Coach Prosper's World) */}
          {isCPW && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
                  {nextSection()} — Lessons Learned
                </h2>
                <ul className="space-y-4">
                  {cpwLessons.map((lesson, i) => (
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
