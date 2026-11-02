import React from 'react';
import { Command, CommandContext } from '../types';
import { validateProjectKey } from '../argumentValidators';
import { InfoHeader, StatusBadge } from '../components/TerminalUI';

interface ProjectArchitectureData {
  id: string;
  name: string;
  category: string;
  overview: string;
  frontend: string[];
  backend: string[];
  database: string[];
  offlineOrAlgorithm: string[];
  dataFlowDiagram: string;
  decisions: string[];
  limitations: string[];
  ctaLink: string;
}

const ARCHITECTURES: Record<string, ProjectArchitectureData> = {
  cfss: {
    id: 'cfss',
    name: 'Community Field Survey System (CFSS)',
    category: 'OFFLINE-FIRST & SYSTEMS ARCHITECTURE',
    overview: 'An institutional data collection platform for university field research in rural and semi-urban communities with zero or intermittent internet connectivity.',
    frontend: [
      'Next.js 14 App Router with TypeScript & Tailwind CSS',
      'Dexie.js abstraction over IndexedDB for client-side survey schema persistence and draft queues',
      'Leaflet GIS mapping with offline tile caching, GPS precision circle overlays, and boundary containment verification',
      'Zod client-side form schema validation ensuring malformed records are rejected before local disk write',
    ],
    backend: [
      'FastAPI (Python 3.11) asynchronous RESTful API gateway with Pydantic v2 schemas',
      'Role-isolated endpoints partitioned between Students (enumerators), Coordinators, and Institutional Admins',
      'Defensive connection budgeting and rate-limiting preventing server starvation during batch synchronization spikes',
      'Automated Celery worker tasks for bulk survey PDF and CSV export generation',
    ],
    database: [
      'PostgreSQL relational schema with foreign key constraints across communities, enumerators, surveys, and audit logs',
      'Compound B-tree indexing on (community_id, created_at) and (enumerator_id, sync_status)',
      'ACID transaction guarantees for draft reconciliation and survey state transitions',
    ],
    offlineOrAlgorithm: [
      'Bi-directional sync manager listening to browser online/offline events with exponential backoff retries',
      'Deterministic field-level reconciliation engine: conflicting fields flagged for coordinator review without silent data overwrites',
      'Local draft lifecycle: Draft → PendingSync → InFlight → Synced',
    ],
    dataFlowDiagram: `[Enumerator Field Tablet]
  │
  ├─ 1. Form Capture + GPS Precision Validation (<15m)
  ├─ 2. IndexedDB (Dexie) Transactional Draft Write
  └─ 3. Sync Observer (Network event detector)
        │
        │ (Online event + Bearer JWT + ETag)
        ▼
[FastAPI Ingress Gateway]
  │
  ├─ 4. Rate-limit Budget Check
  ├─ 5. Pydantic v2 Payload & Schema Validation
  ├─ 6. Role-Based Access Isolation (Coordinator vs Enumerator)
  └─ 7. PostgreSQL ACID Transaction
        │
        ├─ INSERT INTO surveys (...)
        ├─ INSERT INTO survey_audit_log (...)
        └─ ACK 201 Created (ETag / revision)
        ▼
[Client State Update]
  └─ 8. Dexie record transitioned: PendingSync -> Synced`,
    decisions: [
      'Dexie (IndexedDB) chosen over LocalStorage: LocalStorage is synchronous, blocks the UI thread, and is capped at 5MB. IndexedDB supports asynchronous transactions and large geospatial surveys with attachments.',
      'Field-level merge chosen over blind Last-Write-Wins (LWW): In field deployments, coordinators annotate surveys while enumerators collect data; LWW would cause silent data destruction.',
      'Coordinate boundary validation executed client-side first: Saves battery and cellular data by immediately prompting enumerator if GPS fix is outside community boundaries.',
    ],
    limitations: [
      'IndexedDB storage limits are browser/OS dependent (typically up to 80% of available disk space, subject to evictions if disk is critically low).',
      'High-resolution offline map tiles must be pre-cached prior to departure to rural survey sectors.',
    ],
    ctaLink: '/case-study/cfss',
  },
  'mastery-os': {
    id: 'mastery-os',
    name: 'MasteryOS',
    category: 'DATA SYSTEMS & ALGORITHMIC WORKSPACE',
    overview: 'An active retrieval learning engine designed around prerequisite dependency graphs (DAGs) and deterministic spaced repetition intervals.',
    frontend: [
      'Next.js 15 with React 19, strict TypeScript, and Tailwind CSS',
      'React Flow interactive canvas for dynamic prerequisite graph visualization and bottleneck inspection',
      'Active Retrieval UI: Reference explanations and code solutions strictly obscured during recall trials to prevent passive familiarity illusions',
      'Keyboard-first command navigation: 1-5 rating keys, spacebar flips, and quick shortcut transitions',
    ],
    backend: [
      'Next.js server actions and API route handlers wrapped with Zod payload validation',
      'Depth-First Search (DFS) DAG cycle detection validating prerequisite relationships before insertion',
      'Append-only review history engine: every recall grade is logged as an immutable review event',
      'Deterministic SuperMemo SM-2 interval calculator',
    ],
    database: [
      'PostgreSQL schema modeled with Prisma ORM across Courses, Concepts, Dependencies, and ReviewLogs',
      'Relational self-referential many-to-many join table for Concept prerequisites',
      'Compound index on (concept_id, next_review_due) for sub-millisecond study queue retrieval',
    ],
    offlineOrAlgorithm: [
      'SuperMemo SM-2 Algorithm: EF\' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)) where q is recall score (0-5)',
      'DAG Cycle Detection: 3-color graph traversal (White/Grey/Black) via DFS detecting back-edges in O(V + E) time',
      'Failure Root-Cause Traversal: If a learner repeatedly fails a downstream concept, the engine highlights unmastered prerequisite roots',
    ],
    dataFlowDiagram: `[Student Review Action]
  │
  ├─ 1. Active Recall: Blind problem prompt presented
  ├─ 2. Solution Reveal + User Self-Rating (0 to 5)
  └─ 3. POST /api/reviews
        │
        ▼
[Next.js Backend Server]
  │
  ├─ 4. Zod Schema Verification
  ├─ 5. SM-2 Spaced Repetition Computation
  │     └─ New interval, repetition count, and easiness factor (EF)
  ├─ 6. Failure Diagnostic: If q < 3, trace prerequisite tree
  └─ 7. Prisma PostgreSQL Transaction
        │
        ├─ INSERT INTO review_logs (score, latency_ms, concept_id)
        ├─ UPDATE concepts SET next_review = ..., easiness_factor = ...
        └─ Return 200 OK with next queue item
        ▼
[Client State Update]
  └─ 8. Active review session advances immediately`,
    decisions: [
      'Append-only review log chosen over in-place score replacement: Preserves historical learning decay curves and enables long-term retention analytics.',
      'Strict DAG cycle rejection at write-time: Cyclic prerequisites (A requires B which requires A) create unresolvable study deadlocks and infinite loops.',
      'Local-first keyboard shortcut dispatcher: Eliminates latency during rapid active recall drilling.',
    ],
    limitations: [
      'Large prerequisite trees (>1,000 nodes) require virtualized layout calculation on low-end mobile devices.',
      'SM-2 assumes a homogeneous learner memory decay curve; individualized Bayesian knowledge tracing is an area for future exploration.',
    ],
    ctaLink: '/case-study/mastery-os',
  },
  'coach-prospers-world': {
    id: 'coach-prospers-world',
    name: 'Coach Prosper’s World',
    category: 'PRODUCTION PLATFORM & OPERATIONS INFRASTRUCTURE',
    overview: 'A live production portal for an international youth leadership mentorship foundation, serving 100+ active members.',
    frontend: [
      'Next.js App Router with TypeScript and Tailwind CSS',
      'Role-isolated client dashboards for Admins, Members, and Mentorship Applicants',
      'Responsive, accessible application forms with real-time field validation and file upload progress',
      'Integrated Paystack donation checkout modal with client verification callbacks',
    ],
    backend: [
      'Next.js Server Actions and secure API routes',
      'Cryptographically verified Paystack webhook handler: HMAC-SHA512 verification against shared secret',
      'Arkesel SMS Gateway integration: automated applicant status alerts and bulk member broadcasts',
      'NextAuth.js authentication with encrypted session tokens and role guards',
    ],
    database: [
      'PostgreSQL production database with Prisma ORM across 12 relational domains',
      'Dual-tier storage architecture: Public assets in Vercel Blob; private applicant documents vaulted with role-gated signed URLs',
      'Idempotent transaction logic on payment references preventing duplicate account balances',
    ],
    offlineOrAlgorithm: [
      'Paystack Webhook Idempotency: Incoming transaction references checked against processed ledger in ACID transaction',
      'SMS Queueing & Delivery Retries: Asynchronous retry with exponential backoff against Arkesel API',
      'Secure applicant vault: Presigned download links generated on-demand with 15-minute expirations',
    ],
    dataFlowDiagram: `[Paystack Payment Service]
  │
  ├─ 1. External Donation Completed
  └─ 2. HTTP POST Webhook -> /api/webhooks/paystack
        │
        ▼
[Next.js Production API]
  │
  ├─ 3. Verify x-paystack-signature header using HMAC-SHA512(secret, body)
  ├─ 4. Idempotency Check: Verify reference not in transactions table
  ├─ 5. Prisma Transaction:
  │     ├─ INSERT INTO donations (ref, amount, currency, donor_id)
  │     ├─ UPDATE campaigns SET raised = raised + amount
  │     └─ INSERT INTO audit_events (...)
  ├─ 6. Trigger Asynchronous Jobs:
  │     ├─ Arkesel SMS API (Donor receipt SMS)
  │     └─ Member notification email
  └─ 7. Return HTTP 200 OK within 200ms
        ▼
[Operations Dashboard]
  └─ 8. Real-time metrics reflect confirmed contribution`,
    decisions: [
      'Dual-tier storage model chosen: Public assets (banners, logos) stay in CDN; applicant passports and certificates are stored in a private tier accessible only via authenticated admin sessions.',
      'HMAC-SHA512 webhook verification over polling: Eliminates polling overhead and guarantees authentic transactions directly from Paystack.',
      'Direct SMS gateway over email-only: In Ghana and West Africa, SMS delivers >98% immediate read rates compared to variable email accessibility.',
    ],
    limitations: [
      'Vercel serverless function execution timeout (15s) requires heavy batch operations (e.g. bulk SMS to thousands of users) to be chunked into async background tasks.',
    ],
    ctaLink: '/case-study/coach-prospers-world',
  },
  agrichem: {
    id: 'agrichem',
    name: 'AgriChem Data Research Pipeline',
    category: 'DATA ENGINEERING & EVIDENCE RESEARCH',
    overview: 'A reproducible research and data engineering pipeline investigating pesticide residues and regulatory documentation in Ghana’s cocoa agricultural sector.',
    frontend: [
      'Jupyter Research Notebooks with Matplotlib and Seaborn statistical plots',
      'Interactive data validation dashboards inspecting sample distribution and chemical concentrations',
      'Machine-verified evidence register mapping verbatim quotes to page coordinates',
    ],
    backend: [
      'Python 3.11 data cleansing and normalization pipeline using Pandas and NumPy',
      'PDFPlumber coordinate-based table extractor with cross-cell heuristic reconciliation',
      'Tesseract OCR fallback for scanned legacy governmental gazettes',
      'Automated Pytest test suite enforcing schema constraints and unit consistency',
    ],
    database: [
      'Canonical long-format dataset (708 observations) stored in parquet and SQLite',
      'SHA-256 cryptographic checksum register locking immutable source PDFs and reports',
      'Provenance tracking: every data row references source file SHA-256, page number, and table coordinates',
    ],
    offlineOrAlgorithm: [
      'Coordinate-Based Table Extraction: Extracts cells based on vertical/horizontal vector lines rather than text flow',
      'Re-publication Disambiguation Algorithm: Cross-correlates author, sample dates, and chemical metrics to separate original studies from secondary reprints',
      'Missing-Value Semantics: Explicitly separates Below Detection Limit (<LOD) from Not Detected (ND) and Not Reported (NR)',
    ],
    dataFlowDiagram: `[Raw Regulatory Source PDFs]
  │
  ├─ 1. SHA-256 Checksum Verification
  ├─ 2. PDFPlumber Coordinate-Based Cell Extraction
  ├─ 3. Tesseract OCR Fallback (Low-contrast documents)
  └─ 4. Raw Extract Pipeline
        │
        ▼
[Data Normalization Engine (Python)]
  │
  ├─ 5. Unit Harmonization (mg/kg -> ug/kg standardization)
  ├─ 6. Explicit Missing-Value Encoding (<LOD vs ND vs NR)
  ├─ 7. Citation De-duplication & Secondary Reprint Disambiguation
  └─ 8. Pytest Validation Suite (346 automated evidence checks)
        │
        ▼
[Canonical Output Artifacts]
  ├─ 9. Long-format dataset (708 validated observations)
  └─ 10. Machine-verified quote register with page anchors`,
    decisions: [
      'Coordinate-based parsing chosen over LLM or regex: LLMs hallucinate chemical indices and decimal points; coordinate parsing guarantees deterministic character extraction directly from PDF vectors.',
      'SHA-256 source locking: Prevents silent data drift if an upstream government website silently replaces or edits a report.',
      'Explicit missing-value semantics: Grouping "ND" with "<LOD" distorts toxicological risk assessments; maintaining explicit flags preserves scientific integrity.',
    ],
    limitations: [
      'Severely degraded photocopied PDFs from the 1990s still require human-in-the-loop verification for marginal OCR confidence scores.',
    ],
    ctaLink: '/case-study/agrichem',
  },
};

export const inspectCommand: Command = {
  name: 'inspect',
  aliases: ['architecture', 'arch'],
  category: 'Recruiter',
  description: 'Deep technical architecture and systems specification for a project.',
  usage: 'inspect <cfss | mastery | cpw | agrichem>',
  examples: ['inspect cfss', 'inspect mastery', 'inspect cpw', 'inspect agrichem'],
  execute: (args, ctx: CommandContext) => {
    if (args.length === 0) {
      return {
        output: (
          <div className="space-y-3 font-mono text-xs">
            <InfoHeader title="ARCHITECTURE EXPLORER" subtitle="Select a project to inspect deep technical specs" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(ARCHITECTURES).map((arch) => (
                <div key={arch.id} className="p-3 rounded bg-[#292A27] border border-[#45453F] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#82AAFF] uppercase font-bold tracking-wider">{arch.category}</div>
                    <div className="font-bold text-[#F0EEE7] text-sm">{arch.name}</div>
                    <p className="text-[#A6A397] text-[11px] line-clamp-2 mt-1">{arch.overview}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => ctx.runCommand(`inspect ${arch.id}`)}
                      className="px-2.5 py-1 rounded bg-[#82AAFF]/15 text-[#82AAFF] hover:bg-[#82AAFF]/25 font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      $ inspect {arch.id}
                    </button>
                    <button
                      type="button"
                      onClick={() => ctx.runCommand(`trace ${arch.id}`)}
                      className="px-2 py-1 rounded bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      $ trace {arch.id}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-[#A6A397]">
              Usage: <code className="text-[#82AAFF] font-bold">inspect &lt;project&gt;</code> (e.g. inspect cfss, inspect mastery).
            </div>
          </div>
        ),
      };
    }

    const val = validateProjectKey(args[0]);
    if (!val.valid || !val.value) {
      return { error: val.error };
    }

    const arch = ARCHITECTURES[val.value];
    if (!arch) {
      return { error: `Architecture specification for '${args[0]}' is unavailable.` };
    }

    return {
      output: (
        <div className="p-3.5 sm:p-5 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#45453F] gap-2">
            <div>
              <div className="text-[10px] text-[#82AAFF] uppercase font-bold tracking-wider">
                {arch.category}
              </div>
              <div className="text-sm sm:text-base font-bold text-[#F0EEE7]">
                {arch.name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => ctx.runCommand(`trace ${arch.id}`)}
                className="px-2.5 py-1 rounded bg-[#7EC28D]/20 text-[#7EC28D] border border-[#7EC28D]/40 hover:bg-[#7EC28D]/30 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                $ trace {arch.id}
              </button>
              <button
                type="button"
                onClick={() => ctx.navigate(arch.ctaLink)}
                className="px-2.5 py-1 rounded bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] border border-[#45453F] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Open Case Study →
              </button>
            </div>
          </div>

          {/* System Overview */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[#A6A397] tracking-wider mb-1">
              System Overview
            </div>
            <p className="text-[#F0EEE7] leading-relaxed">
              {arch.overview}
            </p>
          </div>

          {/* Architectural Layers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Frontend */}
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#82AAFF] flex items-center gap-1.5">
                <span>[FRONTEND]</span> <span>Architecture</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#A6A397] leading-relaxed">
                {arch.frontend.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#82AAFF]">-</span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend */}
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7EC28D] flex items-center gap-1.5">
                <span>[BACKEND]</span> <span>Architecture</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#A6A397] leading-relaxed">
                {arch.backend.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#7EC28D]">-</span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Database */}
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#E5C07B] flex items-center gap-1.5">
                <span>[DATABASE]</span> <span>Responsibilities</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#A6A397] leading-relaxed">
                {arch.database.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#E5C07B]">-</span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Offline or Algorithm */}
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#C678DD] flex items-center gap-1.5">
                <span>[ALGORITHM]</span> <span>Offline Protocol & Core Logic</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#A6A397] leading-relaxed">
                {arch.offlineOrAlgorithm.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#C678DD]">-</span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ASCII Data Flow Diagram */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[#A6A397] tracking-wider mb-1.5">
              End-to-End Data Flow Diagram
            </div>
            <pre className="p-3 rounded bg-[#20211F] border border-[#45453F] text-[#F0EEE7] text-xs whitespace-pre overflow-x-auto leading-relaxed">
              {arch.dataFlowDiagram}
            </pre>
          </div>

          {/* Key Decisions */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[#A6A397] tracking-wider mb-1.5">
              Key Engineering Decisions & Trade-offs
            </div>
            <ul className="space-y-1.5 text-[11.5px] text-[#A6A397] leading-relaxed pl-2 border-l-2 border-[#45453F]">
              {arch.decisions.map((dec, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#7EC28D] font-bold">[+]</span>
                  <span>{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[#E5C07B] tracking-wider mb-1.5">
              Known Limitations & Boundary Constraints
            </div>
            <ul className="space-y-1 text-[11.5px] text-[#A6A397] leading-relaxed pl-2 border-l-2 border-[#E5C07B]/40">
              {arch.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#E5C07B] font-bold">[!]</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    };
  },
  getSubcommands: () => ['cfss', 'mastery', 'cpw', 'agrichem'],
};
