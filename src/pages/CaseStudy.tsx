import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Lock } from 'lucide-react';
import { deployedWork, projects } from '../data/projects';
import { projectEvidence } from '../data/projectEvidence';
import { projectMedia } from '../data/projectMedia';
import { ScrollReveal } from '../components/ScrollReveal';
import { ProjectEvidenceSection } from '../components/projects/ProjectEvidenceSection';
import { PreviewNote, ProjectScreen, getPreviewKind } from '../components/projects/ProjectScreen';
import { ArrowLink } from '../components/ui/ArrowLink';
import { Button } from '../components/ui/Button';
import { LayeredSurface } from '../components/ui/LayeredSurface';
import { StatusTag, Tag } from '../components/ui/Tag';
import { Footer } from '../sections/Footer';

// ==========================================
// Architecture Data Definitions
// ==========================================

const cfssArchitecture = [
  { layer: 'Student & Coordinator Portals', desc: 'Progressive web interface with Leaflet GIS mapping & GPS capture' },
  { layer: 'IndexedDB / Dexie Storage', desc: 'Local draft persistence and offline synchronization queue' },
  { layer: 'Bi-Directional Sync Layer', desc: 'Resolves survey conflict states when connectivity returns' },
  { layer: 'FastAPI Backend Engine', desc: 'Python 3.12 API with role-based auth, rate-limiting & PDF generation' },
  { layer: 'PostgreSQL Database', desc: 'Relational storage for survey schemas, respondents, and spatial geometries' },
  { layer: 'Celery / Redis Worker Layer', desc: 'Background tasks for heavy batch exports and notification outboxes' },
];

const cpwArchitecture = [
  { layer: 'Next.js App Router', desc: 'Full-stack SSR/SSG client and server route endpoints' },
  { layer: 'NextAuth Security Layer', desc: 'Role-based access control, session validation & audit logging' },
  { layer: 'Prisma ORM & PostgreSQL', desc: 'Relational data modeling across 12 operational domains' },
  { layer: 'Dual-Tier Vercel Blob Storage', desc: 'Private store for applicant photos & public CMS media' },
  { layer: 'Paystack Payment Gateway', desc: 'Donation initialization & HMAC-SHA512 webhook verification' },
  { layer: 'Arkesel SMS Gateway', desc: 'Automated application SMS notifications & administrative broadcast' },
];

const masteryArchitecture = [
  { layer: 'Next.js 15 & React 19 Frontend', desc: 'Interactive active-recall review session engine with keyboard shortcuts' },
  { layer: 'Knowledge Dependency Graph', desc: 'React Flow visualization with DAG cycle detection via Depth-First Search' },
  { layer: 'SM-2 Scheduling Engine', desc: 'Deterministic spaced repetition calculator with bounded ease factors' },
  { layer: 'Diagnostic Failure Service', desc: 'Identifies prerequisite bottlenecks when recall attempts fail' },
  { layer: 'Prisma ORM & PostgreSQL', desc: 'Transactional schedule updates and append-only review history' },
  { layer: 'Vitest Automated Suite', desc: 'Unit tests validating scheduling intervals, ease factor limits & graph DAGs' },
];

const agrichemArchitecture = [
  { layer: 'Immutable Source Archive', desc: '7 regulatory and academic PDF sources locked with SHA-256 checksums' },
  { layer: 'Coordinate Table Parser & OCR', desc: 'Custom table extraction with Tesseract OCR fallback for scanned pages' },
  { layer: 'Verbatim Evidence Register', desc: '346 verbatim quotes machine-verified against source coordinates and pages' },
  { layer: 'Canonicalization Engine', desc: 'Normalizes fragmented schemas into 708 standardized long-format records' },
  { layer: 'Automated Validation Suite', desc: 'Pytest suite verifying schema constraints, limits, and scientific consistency' },
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

// ==========================================
// Presentation
// ==========================================

function ArchitectureDiagram({ items }: { items: { layer: string; desc: string }[] }) {
  return (
    <ol className="rows mt-6">
      {items.map((item, i) => (
        <li key={item.layer}>
          <ScrollReveal delay={i * 60} className="flex items-baseline gap-5 py-4">
            <span className="text-small font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <p className="text-body font-bold text-ink">{item.layer}</p>
              <p className="mt-0.5 text-small text-ink-soft">{item.desc}</p>
            </div>
          </ScrollReveal>
        </li>
      ))}
    </ol>
  );
}

function CaseSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section>
      <ScrollReveal>
        <h2 className="eyebrow">
          {number} — {title}
        </h2>
      </ScrollReveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DotList({ items, tone = 'accent', columns = false }: { items: string[]; tone?: 'accent' | 'positive'; columns?: boolean }) {
  return (
    <ul className={columns ? 'grid gap-x-8 gap-y-3 md:grid-cols-2' : 'space-y-3'}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-body text-ink-soft">
          <span
            className={`mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'positive' ? 'bg-positive' : 'bg-lavender'}`}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudy() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id && p.hasCaseStudy !== false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Team projects are presented through their evidence page.
  const evidenceProject = deployedWork.find((p) => p.id === id);
  const evidence = id ? projectEvidence[id] : undefined;
  if (evidenceProject && evidence) {
    return (
      <>
        <main className="section-padding pb-section pt-28">
          <ProjectEvidenceSection project={evidenceProject} evidence={evidence} />
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center section-padding">
        <div className="text-center">
          <h1 className="mb-6 text-headline font-bold text-ink">Project not found</h1>
          <ArrowLink to="/" back>
            Back to home
          </ArrowLink>
        </div>
      </div>
    );
  }

  const isCFSS = project.id === 'cfss';
  const isCPW = project.id === 'coach-prospers-world';
  const isMastery = project.id === 'mastery-os';
  const isAgriChem = project.id === 'agrichem';

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

  const media = projectMedia[project.id] ?? [];
  const moreMedia = media.slice(1);
  const hasPreview = getPreviewKind(project) !== 'none';

  let sectionNum = 0;
  const nextSection = () => String(++sectionNum).padStart(2, '0');

  return (
    <>
      <main className="section-padding pb-section pt-28">
        <article className="container-content">
          {/* Header */}
          <header>
            <ArrowLink to="/" back className="!text-ink-muted">
              Back to home
            </ArrowLink>

            <ScrollReveal className="mt-10">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <p className="eyebrow">{project.category}</p>
                <StatusTag status={project.status} />
              </div>

              <h1 className="mt-5 max-w-4xl break-words text-display font-extrabold text-ink text-balance">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lead font-medium text-ink-muted md:text-xl">{project.subtitle}</p>

              {/* Actions and context */}
              <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-4">
                {project.liveUrl && (
                  <Button href={project.liveUrl} external icon="diagonal" className="mr-2">
                    Visit Live Website
                  </Button>
                )}
                {isCPW && <Tag tone="lavender" className="px-3 py-1.5">Role: Software & Technology Lead</Tag>}
                {isCFSS && <Tag tone="lavender" className="px-3 py-1.5">Stage: Pre-Production Staging & Test Suite</Tag>}
                {isMastery && <Tag tone="lavender" className="px-3 py-1.5">Stage: Built Implementation & Unit Test Suite</Tag>}
                {isAgriChem && <Tag tone="lavender" className="px-3 py-1.5">Stage: Evidence Register & Canonical Datasets</Tag>}
                {project.isPrivateRepo && (
                  <Tag className="px-3 py-1.5">
                    <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    Source Code Private
                  </Tag>
                )}
              </div>
            </ScrollReveal>
          </header>

          {/* Genuine screenshots, where they exist */}
          {hasPreview && (
            <ScrollReveal className="mt-14 max-w-4xl">
              <figure>
                <ProjectScreen project={project} eager />
                <figcaption className="mt-4 flex flex-col gap-1 text-small text-ink-muted sm:flex-row sm:items-center sm:justify-between">
                  <PreviewNote project={project} />
                  <span>
                    {isCPW ? (
                      <>
                        Verified Public Interface: coachprospersworld.org ·{' '}
                        <span className="font-medium text-positive">Active in Production</span>
                      </>
                    ) : (
                      media[0]?.caption
                    )}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          )}

          {moreMedia.length > 0 && (
            <div className="mt-10 grid max-w-4xl gap-grid sm:grid-cols-2">
              {moreMedia.map((item) => (
                <ScrollReveal key={item.src}>
                  <figure>
                    <img
                      className="shot"
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                    />
                    {item.caption && <figcaption className="mt-3 text-small text-ink-muted">{item.caption}</figcaption>}
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          )}

          <div className="mt-16 grid items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
            {/* Technologies */}
            <aside className="lg:sticky lg:top-28 lg:order-last">
              <ScrollReveal>
                <LayeredSurface stack="none" tone="sunken" faceClassName="p-6">
                  <h2 className="text-small font-semibold text-ink">Technologies</h2>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Tag tone="surface">{tech}</Tag>
                      </li>
                    ))}
                  </ul>
                </LayeredSurface>
              </ScrollReveal>
            </aside>

            <div className="max-w-3xl space-y-16">
              {/* Overview */}
              <CaseSection number={nextSection()} title="Overview">
                <ScrollReveal>
                  <p className="text-title font-medium text-ink md:text-xl md:leading-relaxed">{project.description}</p>
                </ScrollReveal>
              </CaseSection>

              {/* Problem */}
              {project.problem && (
                <CaseSection number={nextSection()} title="Problem Statement">
                  <ScrollReveal>
                    <p className="text-body text-ink-soft">{project.problem}</p>
                  </ScrollReveal>
                </CaseSection>
              )}

              {/* System */}
              {project.system && (
                <CaseSection number={nextSection()} title="System Architecture">
                  <ScrollReveal>
                    <p className="text-body text-ink-soft">{project.system}</p>
                  </ScrollReveal>
                  <ArchitectureDiagram items={architectureItems} />
                </CaseSection>
              )}

              {/* Key Capabilities */}
              {project.capabilities && (
                <CaseSection number={nextSection()} title="Key Capabilities & Features">
                  <ScrollReveal>
                    <DotList items={project.capabilities} columns />
                  </ScrollReveal>
                </CaseSection>
              )}

              {/* Engineering Decisions & Constraints */}
              <CaseSection number={nextSection()} title="Engineering Decisions & Reliability">
                <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {decisionsItems.map((decision, idx) => (
                    <ScrollReveal key={decision.title} delay={idx * 60}>
                      <h3 className="text-body font-bold text-ink">{decision.title}</h3>
                      <p className="mt-2 text-small text-ink-soft">{decision.detail}</p>
                    </ScrollReveal>
                  ))}
                </div>
              </CaseSection>

              {/* My Role & Engineering Contribution */}
              <CaseSection number={nextSection()} title="My Engineering Contribution">
                <ScrollReveal>
                  <DotList items={contributionsItems} />
                </ScrollReveal>
              </CaseSection>

              {/* Verified Evidence & Test Coverage */}
              <CaseSection number={nextSection()} title="Verified Evidence & Testing">
                <ScrollReveal>
                  <DotList items={evidenceItems} tone="positive" />
                </ScrollReveal>
              </CaseSection>

              {/* Scale statement */}
              {project.scaleStatement && (
                <ScrollReveal className="pt-4">
                  <LayeredSurface tone="inverse" faceClassName="p-card lg:p-9">
                    <p className="text-title font-semibold leading-relaxed md:text-xl md:leading-relaxed">
                      {project.scaleStatement}
                    </p>
                  </LayeredSurface>
                </ScrollReveal>
              )}

              {/* Back link */}
              <ArrowLink to="/" back>
                Back to all work
              </ArrowLink>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
