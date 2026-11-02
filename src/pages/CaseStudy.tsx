import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { projects } from '../data/projects';
import { ProjectStatus } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../sections/Footer';

// ==========================================
// Architecture Data Definitions
// ==========================================

const cfssArchitecture = [
  { layer: 'Student & Coordinator Portals', desc: 'Progressive web interface with Leaflet GIS mapping & GPS capture', icon: '👤' },
  { layer: 'IndexedDB / Dexie Storage', desc: 'Local draft persistence and offline synchronization queue', icon: '💾' },
  { layer: 'Bi-Directional Sync Layer', desc: 'Resolves survey conflict states when connectivity returns', icon: '🔄' },
  { layer: 'FastAPI Backend Engine', desc: 'Python 3.12 API with role-based auth, rate-limiting & PDF generation', icon: '⚡' },
  { layer: 'PostgreSQL Database', desc: 'Relational storage for survey schemas, respondents, and spatial geometries', icon: '🗄' },
  { layer: 'Celery / Redis Worker Layer', desc: 'Background tasks for heavy batch exports and notification outboxes', icon: '⚙' },
];

const cpwArchitecture = [
  { layer: 'Next.js App Router', desc: 'Full-stack SSR/SSG client and server route endpoints', icon: '▲' },
  { layer: 'NextAuth Security Layer', desc: 'Role-based access control, session validation & audit logging', icon: '🛡' },
  { layer: 'Prisma ORM & PostgreSQL', desc: 'Relational data modeling across 12 operational domains', icon: '🗄' },
  { layer: 'Dual-Tier Vercel Blob Storage', desc: 'Private store for applicant photos & public CMS media', icon: '☁' },
  { layer: 'Paystack Payment Gateway', desc: 'Donation initialization & HMAC-SHA512 webhook verification', icon: '💳' },
  { layer: 'Arkesel SMS Gateway', desc: 'Automated application SMS notifications & administrative broadcast', icon: '📱' },
];

const masteryArchitecture = [
  { layer: 'Next.js 15 & React 19 Frontend', desc: 'Interactive active-recall review session engine with keyboard shortcuts', icon: '▲' },
  { layer: 'Knowledge Dependency Graph', desc: 'React Flow visualization with DAG cycle detection via Depth-First Search', icon: '🕸' },
  { layer: 'SM-2 Scheduling Engine', desc: 'Deterministic spaced repetition calculator with bounded ease factors', icon: '⏱' },
  { layer: 'Diagnostic Failure Service', desc: 'Identifies prerequisite bottlenecks when recall attempts fail', icon: '🔍' },
  { layer: 'Prisma ORM & PostgreSQL', desc: 'Transactional schedule updates and append-only review history', icon: '🗄' },
  { layer: 'Vitest Automated Suite', desc: 'Unit tests validating scheduling intervals, ease factor limits & graph DAGs', icon: '🧪' },
];

const agrichemArchitecture = [
  { layer: 'Immutable Source Archive', desc: '7 regulatory and academic PDF sources locked with SHA-256 checksums', icon: '📄' },
  { layer: 'Coordinate Table Parser & OCR', desc: 'Custom table extraction with Tesseract OCR fallback for scanned pages', icon: '📐' },
  { layer: 'Verbatim Evidence Register', desc: '346 verbatim quotes machine-verified against source coordinates and pages', icon: '📋' },
  { layer: 'Canonicalization Engine', desc: 'Normalizes fragmented schemas into 708 standardized long-format records', icon: '🔄' },
  { layer: 'Automated Validation Suite', desc: 'Pytest suite verifying schema constraints, limits, and scientific consistency', icon: '🧪' },
];

// ==========================================
// Decisions & Contributions Data
// ==========================================

const cfssDecisions = [
  {
    title: 'Offline-First Local Queueing via Dexie',
    detail: 'Field workers frequently operate in remote communities without cellular data. All draft surveys, respondent records, and GPS breadcrumbs persist in IndexedDB first, automatically queuing for background sync once the device reconnects.',
  },
  {
    title: 'Defensive GPS Accuracy & Boundary Validation',
    detail: 'Mobile GPS hardware exhibits significant signal variance in field environments. Implemented boundary and accuracy thresholds to filter anomalous readings before computing survey area polygons or traveling distances.',
  },
  {
    title: 'Strict Role-Specific Workflow Isolation',
    detail: 'Enforced role isolation across Students, Field Coordinators, and Administrators. Students can only access assigned surveys and communities, coordinators review and approve field submissions, and administrators manage global rosters and configurations.',
  },
  {
    title: 'Connection Budgeting on Managed PostgreSQL',
    detail: 'Engineered backend connection budgeting with connection pool constraints to ensure the FastAPI application gracefully throttles requests under connection exhaustion without crashing database workers.',
  },
];

const cfssContribution = [
  'Architected the offline-first survey collection flow utilizing IndexedDB (Dexie) and service workers',
  'Developed the bi-directional survey synchronization and conflict-resolution engine',
  'Integrated Leaflet and MapLibre GIS mapping for student community boundary calculations and GPS logging',
  'Engineered role-isolated FastAPI route controllers and dependency injectors for Student, Coordinator, and Admin workflows',
  'Implemented automated PDF export generation for survey data and student rosters using jsPDF',
  'Verified system reliability against Neon PostgreSQL staging with over 50 automated test suites',
];

const cfssEvidence = [
  '50+ backend automated test suites passing (covering auth flows, GIS mapping, sync logic, and role isolation)',
  'Playwright end-to-end recovery test suite verifying authentication, PDF exports, and admin mutations',
  'Local staging verification against Neon PostgreSQL confirming connection budgets, rate limits, and RBAC enforcement',
  'Verified offline draft creation and synchronization recovery without data loss',
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

const cpwContribution = [
  'Served as Software & Technology Lead, directing technical architecture and production readiness',
  'Engineered Next.js full-stack architecture with TypeScript, Tailwind CSS, and PostgreSQL',
  'Designed a dual-tier Vercel Blob storage pipeline to strictly isolate confidential applicant records',
  'Implemented Paystack donation integration with cryptographic webhook signature verification',
  'Engineered Arkesel SMS messaging infrastructure for automated application alerts and admin messaging',
  'Built custom NextAuth authentication with role-based access control and admin security middleware',
  'Structured entity SEO with Schema.org JSON-LD, dynamic sitemaps, and robots directives',
  'Developed automated integration and security test suites covering admin routes and webhook integrity',
];

const cpwEvidence = [
  'Live production platform active at coachprospersworld.org with automated payment and SMS workflows',
  '9 automated security and integration test suites passing in repository',
  'Verified cryptographic HMAC-SHA512 signature validation on Paystack webhook routes',
  'Zero public indexing of private applicant uploads through dual-tier storage separation',
];

const masteryDecisions = [
  {
    title: 'Deterministic SM-2 Algorithm Implementation',
    detail: 'Implemented a pure, deterministic SM-2 baseline calculation: ratings of FORGOT reset intervals to 1 day; HARD, MEDIUM, and EASY expand intervals based on calculated ease factors. Guaranteed minimum ease factor of 1.30 and integer day rounding prevents scheduling instability.',
  },
  {
    title: 'DAG Cycle Detection via Depth-First Search',
    detail: 'Before persisting a prerequisite dependency between two concepts, a cycle detection service performs a depth-first search on the directed graph, preventing circular dependencies that would break review ordering.',
  },
  {
    title: 'Retrieval-First Psychological Enforcement',
    detail: 'Reference explanations and canonical notes are strictly hidden on initial prompt display. Students must actively retrieve and explain the concept before self-evaluating against the reference answer, preventing the illusion of competence.',
  },
  {
    title: 'Transactional Schedule State & Append-Only Log',
    detail: 'Every review attempt creates an immutable Review record while atomically updating the concept\'s scheduling interval, ease factor, and repetition count within a single Prisma transaction.',
  },
];

const masteryContribution = [
  'Architected the full-stack Next.js 15 application with React 19, TypeScript, and Prisma ORM on PostgreSQL',
  'Implemented the pure SM-2 scheduling service with boundary value protection and deterministic interval calculations',
  'Built the graph dependency service with depth-first search (DFS) cycle validation',
  'Developed the interactive review session engine enforcing active recall without premature answer visibility',
  'Created the diagnostic failure tracking service linking concept difficulties back to missing prerequisite fundamentals',
  'Wrote comprehensive Vitest unit test suites validating scheduling rules and graph algorithms',
];

const masteryEvidence = [
  '18 passing unit tests in Vitest covering scheduling service formulas and graph cycle prevention',
  'Strict TypeScript compilation with zero type errors across all route handlers and services',
  'Complete relational schema modeled in Prisma covering courses, concepts, dependencies, reviews, and failures',
  'Verified cycle rejection preventing invalid topological ordering in concept graphs',
];

const agrichemDecisions = [
  {
    title: 'Verbatim Quote Machine Verification',
    detail: 'Every evidence item in the register is tied to a verbatim quote verified against extracted text at specific page coordinates, eliminating hallucinations and manual citation drift.',
  },
  {
    title: 'Explicit Handling of Missing & Undefined Values',
    detail: 'Raw study tables contained notations like ND (non-detect), <0.01 (below LOD), and dashes (-). The pipeline preserves explicit missing-value semantics rather than converting unknown or below-detection quantities to zero.',
  },
  {
    title: 'Disambiguation of Re-Publications',
    detail: 'Identified that an article published in 2016 reused the exact organophosphorus sample data from the 2015 thesis, correctly classifying it as a re-publication rather than independent corroborating evidence.',
  },
  {
    title: 'Cryptographic Checksum Locking of Sources',
    detail: 'All raw PDFs and regulatory registry documents are locked with SHA-256 hashes in a central manifest, halting execution if any upstream source file is altered or corrupted.',
  },
];

const agrichemContribution = [
  'Engineered the Python research pipeline with modular extraction, parsing, and analysis packages',
  'Developed coordinate-based table parsers to extract multi-column pesticide concentration tables from complex thesis layouts',
  'Implemented Tesseract OCR fallback for scanned government registries (MoFA)',
  'Built the verified evidence register tying 346 machine-checked quotes directly to source pages',
  'Created long-format canonical datasets normalizing 708 observation cells across water, soil, and cocoa matrices',
  'Authored comprehensive Pytest suites verifying schema consistency and study limits',
];

const agrichemEvidence = [
  '346 machine-verified evidence quotes cross-checked against source page coordinates',
  '708 canonical observation cells extracted and validated across water, soil, and cocoa beans',
  'Automated Pytest validation suite enforcing schema rules, LOD constraints, and provenance',
  'Source manifest with SHA-256 checksums locking 7 primary documents',
];

const statusStyles: Record<ProjectStatus, { bg: string; text: string; border: string; dot?: string }> = {
  LIVE: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  BUILT: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  'IN PROGRESS': {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  RESEARCH: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/60',
    dot: 'bg-purple-500 dark:bg-purple-400',
  },
  PLANNED: {
    bg: 'bg-gray-50 dark:bg-neutral-900/50',
    text: 'text-gray-600 dark:text-neutral-400',
    border: 'border-gray-200 dark:border-neutral-800',
  },
};

function ArchitectureDiagram({ items }: { items: { layer: string; desc: string; icon: string }[] }) {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();
  const { isDark } = useTheme();

  return (
    <div ref={ref} className="my-10">
      {items.map((item, i) => (
        <div key={item.layer} className="flex items-start gap-5 mb-0.5">
          <div className="flex flex-col items-center">
            {/* Node */}
            <div
              className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm"
              style={{
                borderColor: isInView ? (isDark ? '#ededeb' : '#111111') : isDark ? '#282a32' : '#D1D5DB',
                backgroundColor: isInView ? (isDark ? '#1c1e24' : '#F9FAFB') : 'transparent',
                transform: isInView ? 'scale(1)' : 'scale(0.8)',
                transition: reducedMotion
                  ? 'none'
                  : `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
              }}
            >
              <span
                style={{
                  opacity: isInView ? 1 : 0,
                  transition: reducedMotion ? 'none' : `opacity 0.4s ease ${i * 100 + 150}ms`,
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
                  backgroundColor: isInView ? (isDark ? '#ededeb' : '#111111') : isDark ? '#282a32' : '#D1D5DB',
                  transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
                  transition: reducedMotion
                    ? 'none'
                    : `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100 + 60}ms, background-color 0.4s ease ${i * 100}ms`,
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
                : `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
            }}
          >
            <p className="text-[15px] font-bold text-gray-900 dark:text-[#ededeb]">{item.layer}</p>
            <p className="text-sm text-gray-500 dark:text-neutral-400">{item.desc}</p>
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
      className="my-10 rounded-xl overflow-hidden border border-gray-200/90 dark:border-[#282a32] shadow-xl bg-[#0a120e] transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'none' : 'translateY(16px)',
        transition: reducedMotion ? 'none' : 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1d16] border-b border-gray-800 dark:border-[#282a32]">
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
      <div className="bg-[#0a120e] relative aspect-[16/10] overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>
      <div className="px-5 py-3 bg-[#0f1d16] border-t border-gray-800/80 dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-gray-400 font-mono">
        <span>Verified Public Interface: coachprospersworld.org</span>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#ededeb] mb-4">Project not found</h1>
          <Link to="/" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isCFSS = project.id === 'cfss';
  const isCPW = project.id === 'coach-prospers-world';
  const isMastery = project.id === 'mastery-os';
  const isAgriChem = project.id === 'agrichem';

  const badge = statusStyles[project.status] || statusStyles.BUILT;

  let architectureItems = cpwArchitecture;
  let decisionsItems = cpwDecisions;
  let contributionsItems = cpwContribution;
  let evidenceItems = cpwEvidence;

  if (isCFSS) {
    architectureItems = cfssArchitecture;
    decisionsItems = cfssDecisions;
    contributionsItems = cfssContribution;
    evidenceItems = cfssEvidence;
  } else if (isMastery) {
    architectureItems = masteryArchitecture;
    decisionsItems = masteryDecisions;
    contributionsItems = masteryContribution;
    evidenceItems = masteryEvidence;
  } else if (isAgriChem) {
    architectureItems = agrichemArchitecture;
    decisionsItems = agrichemDecisions;
    contributionsItems = agrichemContribution;
    evidenceItems = agrichemEvidence;
  }

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
              className="group inline-flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-[#ededeb] transition-colors mb-10"
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
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500">
                  {project.category}
                </span>
                <span className="text-gray-300 dark:text-neutral-700">·</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {badge.dot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${
                        project.status === 'LIVE' ? 'animate-pulse' : ''
                      }`}
                    />
                  )}
                  {project.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-[#ededeb] tracking-tighter mb-3">
                {project.title}
              </h1>
              <p className="text-lg md:text-xl font-medium text-gray-500 dark:text-neutral-400 mb-8">
                {project.subtitle}
              </p>

              {/* Action Links & Metadata Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider uppercase text-white dark:text-[#121316] bg-gray-900 dark:bg-[#ededeb] hover:bg-black dark:hover:bg-white rounded-lg transition-colors shadow-sm"
                  >
                    Visit Live Website
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {isCPW && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-neutral-200 bg-gray-100 dark:bg-[#1c1e24] rounded-lg border border-gray-200 dark:border-[#282a32]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Role: Software & Technology Lead
                  </span>
                )}
                {isCFSS && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60">
                    Stage: Pre-Production Staging & Test Suite
                  </span>
                )}
                {isMastery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60">
                    Stage: Built Implementation & Unit Test Suite
                  </span>
                )}
                {isAgriChem && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800/60">
                    Stage: Evidence Register & Canonical Datasets
                  </span>
                )}
                {project.isPrivateRepo && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 bg-gray-50 dark:bg-[#1c1e24] rounded-lg border border-gray-200 dark:border-[#282a32]">
                    <svg className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Source Code Private
                  </span>
                )}
              </div>
            </ScrollReveal>
          </section>

          {/* Genuine Browser Frame Visual Preview (Coach Prosper's World) */}
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
                    className="px-3 py-1.5 text-[11px] font-semibold tracking-wide text-gray-600 dark:text-neutral-300 bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-[#282a32] rounded"
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
              <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                {nextSection()} — Overview
              </h2>
              <p className="text-lg text-gray-700 dark:text-neutral-200 leading-relaxed">{project.description}</p>
            </ScrollReveal>
          </section>

          {/* Problem */}
          {project.problem && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                  {nextSection()} — Problem Statement
                </h2>
                <p className="text-[15px] text-gray-600 dark:text-neutral-300 leading-[1.75]">{project.problem}</p>
              </ScrollReveal>
            </section>
          )}

          {/* System */}
          {project.system && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                  {nextSection()} — System Architecture
                </h2>
                <p className="text-[15px] text-gray-600 dark:text-neutral-300 leading-[1.75] mb-6">{project.system}</p>
              </ScrollReveal>
              <ArchitectureDiagram items={architectureItems} />
            </section>
          )}

          {/* Key Capabilities */}
          {project.capabilities && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                  {nextSection()} — Key Capabilities & Features
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2.5 text-[15px] text-gray-600 dark:text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-neutral-600 mt-2 shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </section>
          )}

          {/* Engineering Decisions & Constraints */}
          <section className="section-padding mb-20 max-w-3xl">
            <ScrollReveal>
              <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                {nextSection()} — Engineering Decisions & Reliability
              </h2>
              <div className="space-y-6">
                {decisionsItems.map((decision, idx) => (
                  <div key={idx} className="border-l-2 border-gray-900 dark:border-[#ededeb] pl-5 py-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-[#ededeb] mb-1.5">
                      {decision.title}
                    </h3>
                    <p className="text-[15px] text-gray-600 dark:text-neutral-300 leading-relaxed">
                      {decision.detail}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* My Role & Engineering Contribution */}
          <section className="section-padding mb-20 max-w-3xl">
            <ScrollReveal>
              <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                {nextSection()} — My Engineering Contribution
              </h2>
              <ul className="space-y-3">
                {contributionsItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[15px] text-gray-600 dark:text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-[#ededeb] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </section>

          {/* Verified Evidence & Test Coverage */}
          <section className="section-padding mb-20 max-w-3xl">
            <ScrollReveal>
              <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-5">
                {nextSection()} — Verified Evidence & Testing
              </h2>
              <ul className="space-y-3">
                {evidenceItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[15px] text-gray-600 dark:text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </section>

          {/* Scale statement */}
          {project.scaleStatement && (
            <section className="section-padding mb-20 max-w-3xl">
              <ScrollReveal>
                <div className="border-l-2 border-gray-900 dark:border-[#ededeb] pl-6 py-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-neutral-200 italic leading-relaxed">
                    {project.scaleStatement}
                  </p>
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Back link */}
          <section className="section-padding mb-16">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
