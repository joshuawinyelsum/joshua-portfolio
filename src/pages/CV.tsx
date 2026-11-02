import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { experience } from '../data/experience';
import { education, credentials } from '../data/education';
import { projects } from '../data/projects';
import { researchAreas } from '../data/research';
import { contactInfo, socialLinks } from '../data/social';
import { Footer } from '../sections/Footer';

export function CV() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Joshua Winyelsum — Curriculum Vitae | Software & Systems Engineer';
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const coreProjects = projects.filter((p) => p.featured);

  return (
    <>
      {/* Top Action Bar (Hidden when printed) */}
      <div className="print:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#282a32] transition-colors">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 min-h-[44px] text-xs font-bold tracking-wider uppercase text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-[#ededeb] transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="inline sm:hidden">Portfolio</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 min-h-[38px] rounded-lg bg-gray-900 dark:bg-[#ededeb] text-white dark:text-[#121316] text-xs font-bold tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              title="Print document or save as PDF"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="inline sm:hidden">Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      <main className="pt-6 sm:pt-12 pb-24 max-w-[860px] mx-auto px-4 sm:px-10 lg:px-12 cv-document">
        <article className="space-y-12 sm:space-y-14 font-sans text-gray-800 dark:text-neutral-200">

          {/* ======================================================== */}
          {/* 1. PROFESSIONAL HEADER                                    */}
          {/* ======================================================== */}
          <header className="border-b border-gray-300 dark:border-[#282a32] pb-8 print:border-black">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 sm:gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-[#ededeb] tracking-tight break-words print:text-black">
                  JOSHUA WINYELSUM
                </h1>
                <p className="text-sm sm:text-base font-semibold tracking-wide text-blue-600 dark:text-blue-400 mt-1 print:text-black">
                  Software & Systems Engineer
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-neutral-400 mt-0.5">
                  Backend Architecture · Relational Databases · Offline-First Systems · Data Pipelines
                </p>
              </div>

              {/* Location Badge */}
              <div className="text-left md:text-right font-mono text-xs text-gray-500 dark:text-neutral-400">
                <span>Tamale / Bawku, Ghana</span>
              </div>
            </div>

            {/* Direct Contact & Profiles Grid */}
            <div className="pt-4 mt-2 border-t border-gray-200/80 dark:border-[#282a32]/60 print:border-gray-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-xs font-mono text-gray-600 dark:text-neutral-300 print:text-black">
              <div>
                <span className="text-[10px] uppercase text-gray-400 dark:text-neutral-500 block">Email</span>
                <a href={`mailto:${contactInfo.email}`} className="text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 font-semibold break-all print:text-black">
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 dark:text-neutral-500 block">Phone / WhatsApp</span>
                <a href="tel:+233247932712" className="text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 font-semibold break-all print:text-black">
                  {contactInfo.phone}
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 dark:text-neutral-500 block">Portfolio</span>
                <a href="https://joshua-winyelsum.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 font-semibold break-all print:text-black">
                  joshua-winyelsum.vercel.app
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 dark:text-neutral-500 block">GitHub</span>
                <a href="https://github.com/joshuawinyelsum" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 font-semibold break-all print:text-black">
                  github.com/joshuawinyelsum
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 dark:text-neutral-500 block">LinkedIn</span>
                <a href="https://www.linkedin.com/in/joshuawinyelsumakum" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 font-semibold break-all print:text-black">
                  linkedin.com/in/joshuawinyelsumakum
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 dark:text-neutral-500 block">Degree Path</span>
                <span className="text-gray-900 dark:text-[#ededeb] font-semibold print:text-black">
                  BSc Computer Science @ UDS
                </span>
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/* 2. PROFESSIONAL PROFILE                                   */}
          {/* ======================================================== */}
          <section className="cv-entry space-y-3">
            <div className="flex items-baseline gap-3 border-b border-gray-200/80 dark:border-[#282a32] pb-1.5 print:border-black">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 dark:text-neutral-500">01 /</span>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb] print:text-black">
                Professional Profile
              </h2>
            </div>
            <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-gray-700 dark:text-neutral-300 text-pretty font-normal">
              Software and systems engineer and Computer Science student at the University for Development Studies with demonstrated experience architecting full-stack web applications, relational schemas, offline-first data platforms, and regulatory data extraction pipelines. Engineering focus centers on building resilient backends with Next.js, FastAPI, and PostgreSQL; establishing relational consistency through Prisma and SQLAlchemy; ensuring local durability with IndexedDB; and enforcing system constraints through comprehensive automated test suites (Vitest, Pytest, Playwright).
            </p>
          </section>

          {/* ======================================================== */}
          {/* 3. TECHNICAL CAPABILITIES                                 */}
          {/* ======================================================== */}
          <section className="cv-entry space-y-4">
            <div className="flex items-baseline gap-3 border-b border-gray-200/80 dark:border-[#282a32] pb-1.5 print:border-black">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 dark:text-neutral-500">02 /</span>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb] print:text-black">
                Technical Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans">
              <div className="space-y-1 pb-2 border-b border-gray-100 dark:border-[#1e2026] md:border-b-0">
                <span className="font-mono font-bold text-[11px] text-gray-900 dark:text-[#ededeb] uppercase tracking-wider block print:text-black">
                  Programming Languages
                </span>
                <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                  TypeScript, Python, JavaScript (ESNext), SQL, HTML5 / CSS3
                </p>
              </div>

              <div className="space-y-1 pb-2 border-b border-gray-100 dark:border-[#1e2026] md:border-b-0">
                <span className="font-mono font-bold text-[11px] text-gray-900 dark:text-[#ededeb] uppercase tracking-wider block print:text-black">
                  Backend & Systems Architecture
                </span>
                <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                  Next.js (App Router), FastAPI, Node.js, REST APIs, Role-Based Access Control (RBAC), Webhooks & HMAC Verification
                </p>
              </div>

              <div className="space-y-1 pb-2 border-b border-gray-100 dark:border-[#1e2026] md:border-b-0">
                <span className="font-mono font-bold text-[11px] text-gray-900 dark:text-[#ededeb] uppercase tracking-wider block print:text-black">
                  Databases & Data Modeling
                </span>
                <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                  PostgreSQL, Prisma ORM, IndexedDB (Dexie), Relational Schema Design, Foreign Key Constraints, Transactional Integrity
                </p>
              </div>

              <div className="space-y-1 pb-2 border-b border-gray-100 dark:border-[#1e2026] md:border-b-0">
                <span className="font-mono font-bold text-[11px] text-gray-900 dark:text-[#ededeb] uppercase tracking-wider block print:text-black">
                  Frontend Engineering
                </span>
                <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                  React 18 / 19, Tailwind CSS, Leaflet GIS Mapping, React Flow (Knowledge Graphs), Accessible Responsive UI
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-[11px] text-gray-900 dark:text-[#ededeb] uppercase tracking-wider block print:text-black">
                  Software Engineering Practices
                </span>
                <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                  Offline-First Architecture, Bi-Directional Synchronization, Directed Acyclic Graph (DAG) Cycle Detection, Defensive Error Handling
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-[11px] text-gray-900 dark:text-[#ededeb] uppercase tracking-wider block print:text-black">
                  Testing, Tooling & Infrastructure
                </span>
                <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
                  Vitest, Pytest, Playwright (E2E), Docker, Linux / Shell, Git & GitHub, Vercel Blob Storage, Arkesel SMS Gateway
                </p>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 4. SELECTED ENGINEERING PROJECTS                          */}
          {/* ======================================================== */}
          <section className="space-y-10">
            <div className="flex items-baseline gap-3 border-b border-gray-200/80 dark:border-[#282a32] pb-1.5 print:border-black">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 dark:text-neutral-500">03 /</span>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb] print:text-black">
                Selected Engineering Projects
              </h2>
            </div>

            {/* Project 1: Coach Prosper's World */}
            <div className="cv-entry space-y-2.5 pl-0 sm:pl-3 border-l-2 border-emerald-600 dark:border-emerald-500 print:border-black">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-[#ededeb] print:text-black">
                    Coach Prosper’s World — Operations Platform & Member Infrastructure
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 print:text-black">
                    Role: Software & Technology Lead | Full-Stack Platform Engineering
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-bold print:border-black">
                    LIVE PRODUCTION
                  </span>
                  <a
                    href="https://coachprospersworld.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-[#ededeb] print:hidden"
                  >
                    <span>coachprospersworld.org</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>

              <p className="text-[13.5px] text-gray-700 dark:text-neutral-300 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Problem & Scope: </span>
                Engineered full-stack digital operations platform for an international youth leadership and mentorship organization. Built to handle confidential member admissions, automated multi-channel SMS notifications, and payment processing without leaking sensitive applicant documentation.
              </p>

              <div className="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed space-y-1">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Key Engineering Decisions: </span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600 dark:text-neutral-300">
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Dual-Tier Storage Isolation:</strong> Partitioned file handling into dedicated private and public Vercel Blob stores with authenticated route-scoped retrieval, preventing public indexing or URL enumeration of sensitive applicant photo IDs.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Payment Idempotency & Security:</strong> Integrated Paystack donation checkout with cryptographic HMAC-SHA512 webhook signature verification, protecting against replay attacks and duplicate event processing.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Defensive SMS Pipeline:</strong> Automated applicant confirmation triggers via Arkesel SMS with asynchronous status logging, shielding client submissions from regional telecom latencies.
                  </li>
                </ul>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-500 dark:text-neutral-400">
                <span><strong>Stack:</strong> Next.js App Router, TypeScript, PostgreSQL, Prisma ORM, NextAuth.js, Paystack, Arkesel SMS, Tailwind CSS</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold print:text-black">Evidence: 9 automated security & integration tests passing in repository</span>
              </div>
            </div>

            {/* Project 2: CFSS */}
            <div className="cv-entry space-y-2.5 pl-0 sm:pl-3 border-l-2 border-blue-600 dark:border-blue-500 print:border-black">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-[#ededeb] print:text-black">
                    Community Field Survey System (CFSS) — Offline-First GIS Survey Platform
                  </h3>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 print:text-black">
                    Role: Systems & Architecture Lead | Offline-First Engineering
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-bold print:border-black">
                    BUILT / STAGED
                  </span>
                  <Link to="/case-study/cfss" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-[#ededeb] print:hidden">
                    <span>Case Study</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <p className="text-[13.5px] text-gray-700 dark:text-neutral-300 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Problem & Scope: </span>
                Institutional field-survey system designed for university field research teams operating in rural communities with zero or intermittent cellular connectivity, enforcing coordinator approvals and data consistency upon synchronization.
              </p>

              <div className="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed space-y-1">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Key Engineering Decisions: </span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600 dark:text-neutral-300">
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Offline-First Local Queueing:</strong> Structured all survey submissions and respondent records to persist in IndexedDB (Dexie) first, automatically queuing mutations for background sync once connectivity returns.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Geospatial Accuracy Guardrails:</strong> Integrated Leaflet GIS mapping with mobile GPS accuracy boundaries to filter multipath satellite errors before recording community coordinate boundaries.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Role-Based Workflow Isolation:</strong> Enforced backend authorization boundaries across Student survey collectors, Field Coordinators (review/approval queue), and Administrators.
                  </li>
                </ul>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-500 dark:text-neutral-400">
                <span><strong>Stack:</strong> FastAPI (Python 3.12), Next.js, PostgreSQL, TypeScript, Dexie (IndexedDB), Leaflet GIS, Docker</span>
                <span>•</span>
                <span className="text-blue-700 dark:text-blue-400 font-semibold print:text-black">Evidence: 50+ backend automated test suites & Playwright E2E recovery test suite</span>
              </div>
            </div>

            {/* Project 3: MasteryOS */}
            <div className="cv-entry space-y-2.5 pl-0 sm:pl-3 border-l-2 border-blue-600 dark:border-blue-500 print:border-black">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-[#ededeb] print:text-black">
                    MasteryOS — Active Recall & Spaced Repetition Learning Engine
                  </h3>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 print:text-black">
                    Role: Lead Full-Stack Architect
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-bold print:border-black">
                    BUILT / TESTED
                  </span>
                  <Link to="/case-study/mastery-os" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-[#ededeb] print:hidden">
                    <span>Case Study</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <p className="text-[13.5px] text-gray-700 dark:text-neutral-300 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Problem & Scope: </span>
                Engineered personal learning engine around active cognitive retrieval, dependency bottleneck diagnosis, and deterministic spaced repetition intervals, countering the illusion of competence inherent in passive study tools.
              </p>

              <div className="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed space-y-1">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Key Engineering Decisions: </span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600 dark:text-neutral-300">
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Deterministic SM-2 Algorithm:</strong> Implemented pure SM-2 interval calculator with boundary-value protection (guaranteed minimum ease factor of 1.30 and integer day rounding).
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">DAG Cycle Prevention via DFS:</strong> Implemented depth-first search graph traversal validating prerequisite links prior to database write, preventing circular concept dependencies.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Transactional Schedule Updates:</strong> Paired immutable Review attempt logging with atomic scheduling updates inside Prisma transactions.
                  </li>
                </ul>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-500 dark:text-neutral-400">
                <span><strong>Stack:</strong> Next.js 15, React 19, TypeScript, PostgreSQL, Prisma ORM, Vitest, React Flow, Tailwind CSS</span>
                <span>•</span>
                <span className="text-blue-700 dark:text-blue-400 font-semibold print:text-black">Evidence: 18 unit tests in Vitest covering scheduling formulas & graph cycle detection</span>
              </div>
            </div>

            {/* Project 4: AgriChem Data Research */}
            <div className="cv-entry space-y-2.5 pl-0 sm:pl-3 border-l-2 border-purple-600 dark:border-purple-500 print:border-black">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-[#ededeb] print:text-black">
                    AgriChem Data Research — Ghana Cocoa Regulatory Data Pipeline
                  </h3>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 print:text-black">
                    Role: Data Systems & Pipeline Researcher
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 font-bold print:border-black">
                    RESEARCH PIPELINE
                  </span>
                  <Link to="/case-study/agrichem" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-[#ededeb] print:hidden">
                    <span>Case Study</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <p className="text-[13.5px] text-gray-700 dark:text-neutral-300 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Problem & Scope: </span>
                Evidence-backed research pipeline investigating pesticide residues and regulatory registries in Ghana's cocoa sector, addressing fragmented data trapped in legacy PDFs, inconsistent reporting formats, and OCR errors.
              </p>

              <div className="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed space-y-1">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-[#ededeb] print:text-black">Key Engineering Decisions: </span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600 dark:text-neutral-300">
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Cryptographic Source Manifest:</strong> Locked all raw source PDFs and official regulatory registries with SHA-256 checksums to ensure immutable provenance.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Verbatim Citation Register:</strong> Machine-verified 346 verbatim evidence quotes directly against source page coordinates, eliminating manual transcription drift.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-neutral-200">Canonical Dataset Normalization:</strong> Harmonized disparate multi-column pesticide concentration tables into 708 standardized long-format records across water, soil, and cocoa bean matrices.
                  </li>
                </ul>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-500 dark:text-neutral-400">
                <span><strong>Stack:</strong> Python 3, Pandas, Pytest, PDF Coordinate Parser, Tesseract OCR, Scientific Schema Harmonization</span>
                <span>•</span>
                <span className="text-purple-700 dark:text-purple-400 font-semibold print:text-black">Evidence: Automated Pytest validation suite enforcing schema rules & LOD limits</span>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 5. RESEARCH & INVESTIGATIONS                             */}
          {/* ======================================================== */}
          <section className="cv-entry space-y-3">
            <div className="flex items-baseline gap-3 border-b border-gray-200/80 dark:border-[#282a32] pb-1.5 print:border-black">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 dark:text-neutral-500">04 /</span>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb] print:text-black">
                Research & Data Systems Investigation
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
              Independent technical investigation distinguished from production software applications:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {researchAreas.map((area) => (
                <div key={area.title} className="p-2.5 rounded bg-gray-50 dark:bg-[#18191e] border border-gray-200/80 dark:border-[#282a32] print:bg-transparent print:border-gray-300">
                  <h3 className="font-bold text-gray-900 dark:text-[#ededeb] mb-1 print:text-black">{area.title}</h3>
                  <p className="text-gray-600 dark:text-neutral-400 leading-relaxed text-[11.5px]">{area.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* 6. PROFESSIONAL EXPERIENCE                                */}
          {/* ======================================================== */}
          <section className="cv-entry space-y-4">
            <div className="flex items-baseline gap-3 border-b border-gray-200/80 dark:border-[#282a32] pb-1.5 print:border-black">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 dark:text-neutral-500">05 /</span>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb] print:text-black">
                Professional Experience
              </h2>
            </div>

            <div className="space-y-6">
              {experience.map((item) => (
                <div key={item.company} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-[#ededeb] print:text-black">
                      {item.company}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 print:text-black">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                  {item.technologies.length > 0 && (
                    <div className="text-[11px] font-mono text-gray-500 dark:text-neutral-400 pt-0.5">
                      Technologies: {item.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* 7. EDUCATION & CREDENTIALS                                */}
          {/* ======================================================== */}
          <section className="cv-entry space-y-4">
            <div className="flex items-baseline gap-3 border-b border-gray-200/80 dark:border-[#282a32] pb-1.5 print:border-black">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 dark:text-neutral-500">06 /</span>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb] print:text-black">
                Education & Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
              {/* Academic Degree */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-neutral-500 block">Degree Program</span>
                {education.map((edu) => (
                  <div key={edu.institution} className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-[#ededeb] print:text-black">{edu.degree}</h3>
                    <p className="text-gray-700 dark:text-neutral-300 font-medium">{edu.institution}</p>
                    <p className="text-[11px] font-mono text-gray-500 dark:text-neutral-400">{edu.location} · {edu.status}</p>
                    {edu.coursework && (
                      <div className="pt-1.5">
                        <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-neutral-500 block">Verified Coursework</span>
                        <p className="text-gray-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                          {edu.coursework.join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Credentials & Scholarship */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-neutral-500 block">Certifications & Awards</span>
                <div className="space-y-3">
                  {credentials.map((cred) => (
                    <div key={cred.title} className="space-y-0.5">
                      <h4 className="font-bold text-gray-900 dark:text-[#ededeb] print:text-black">{cred.title}</h4>
                      <p className="text-gray-600 dark:text-neutral-300 text-[11px]">
                        {cred.issuer} · {cred.type}
                        {cred.year && ` · ${cred.year}`}
                      </p>
                      {cred.score && (
                        <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 print:text-black">
                          Verified Examination Score: {cred.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* 8. TECHNICAL INTERESTS & AFFILIATIONS                    */}
          {/* ======================================================== */}
          <section className="cv-entry pt-4 border-t border-gray-200/80 dark:border-[#282a32] print:border-black text-xs font-mono text-gray-600 dark:text-neutral-400 space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 block">Engineering Focus & Technical Interests</span>
            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed font-sans text-xs">
              Backend Systems Architecture · Relational Database Internals & Query Optimization · Offline-First Synchronization Algorithms · Data Pipeline Extraction & Schema Canonicalization · Applied Machine Learning Systems.
            </p>
          </section>

        </article>
      </main>

      <Footer />
    </>
  );
}
