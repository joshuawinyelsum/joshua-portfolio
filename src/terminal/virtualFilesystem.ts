/**
 * Virtual Read-Only Filesystem
 * 
 * An in-memory, immutable JavaScript representation of a developer workstation directory tree.
 * Does NOT touch or access any real operating-system filesystem.
 * Strictly prevents path traversal outside the virtual root.
 */

export interface VirtualFileEntry {
  name: string;
  type: 'file';
  content: string;
  size: number;
  permissions: string;
  owner: string;
  group: string;
  modified: string;
}

export interface VirtualDirectoryEntry {
  name: string;
  type: 'directory';
  permissions: string;
  owner: string;
  group: string;
  modified: string;
  children: Record<string, VirtualEntry>;
}

export type VirtualEntry = VirtualFileEntry | VirtualDirectoryEntry;

// Content constants for virtual files
const README_CONTENT = `# Joshua Winyelsum: Engineering Workstation
Computer Science Student & Software Engineer
Focus: Backend architecture, relational databases, offline-first systems, and data pipelines.

Location: Tamale, Ghana
Portfolio: https://joshua-winyelsum.vercel.app
GitHub: https://github.com/joshuawinyelsum
LinkedIn: https://linkedin.com/in/joshuawinyelsum

Quick exploration commands:
  $ tour            - Guided 8-step interactive engineering tour
  $ projects        - View featured production & systems projects
  $ inspect cfss    - Deep technical architecture breakdown of CFSS
  $ trace cfss      - Step-by-step request lifecycle simulation
  $ challenge       - Interactive systems engineering challenges
  $ security        - Terminal isolation & security posture audit
`;

const ABOUT_CONTENT = `# About Joshua Winyelsum
I am a Computer Science student at the University for Development Studies and a software engineer.

My technical interests center on backend systems that operate reliably under realistic constraints:
- Relational schema design and transactional integrity in PostgreSQL and MySQL.
- Offline-first local data synchronization (IndexedDB / Dexie) for areas with intermittent connectivity.
- Deterministic algorithms, graph prerequisite modeling (DAGs), and active retrieval engines.
- Data research pipelines with cryptographic source verification and reproducible extraction.

Credentials:
- BSc Computer Science, University for Development Studies (Level 200, 4.69 / 5.00 GPA)
- Google Cybersecurity Professional Certificate (Coursera, 94.52% overall grade, Oct 2024)
`;

const CAREER_CONTENT = `# Career Direction & Engineering Philosophy

Focus Areas:
1. Systems & Backend Engineering: High-integrity RESTful APIs, relational persistence, and role isolation.
2. Offline-First Architecture: Local-first persistence resilient to high latency and network drops.
3. Data Systems & Pipelines: Evidence-driven data cleansing, schema canonicalization, and provenance verification.
4. Distributed Systems Fundamentals: Consensus protocols, partition tolerance, and eventual consistency models.

Engineering Principles:
- Correctness Before Optimization: Verify invariants and transactional boundaries before premature tuning.
- Explicit Failure Modes: Prefer descriptive typed domain errors over silent defaults or swallowed exceptions.
- Verifiable Evidence: Base technical claims on measurable deliverables, passing test suites, and deployed software.
`;

const SKILLS_CONTENT = `# Technical Capabilities

1. Languages & Runtimes:
   - TypeScript, JavaScript, Python, Go, Node.js, SQL

2. Systems & Architecture:
   - REST APIs, Microservices, Offline-First Sync, Event-Driven Patterns, Caching Strategies

3. Databases & Storage:
   - PostgreSQL, MySQL, SQLite, Redis, Schema Migrations, Query Optimization

4. Machine Learning & Data Systems:
   - Data Preprocessing, PyTorch, Scikit-Learn, Feature Extraction, Model Evaluation Pipelines

5. DevOps & Infrastructure:
   - Docker, Git & GitHub Workflows, CI/CD Pipelines, Vercel, Supabase, Linux Environments

6. Engineering Practices:
   - Clean Architecture, Unit & Integration Testing, Defensive Coding, Strict Type Safety
`;

const RESEARCH_CONTENT = `# Research & Data Systems Investigation

AgriChem Data Research (Ghana Cocoa Sector):
- Investigated pesticide residue records and regulatory datasets across Ghanaian government agencies.
- Built reproducible extraction pipeline using coordinate-based PDF parsing and SHA-256 source locking.
- Curated 346 machine-verified quotes cross-checked against source documents.
- Disambiguated re-published secondary citations from independent primary research.

CropMind AI (Exploratory Computer Vision):
- Investigated lightweight convolutional neural networks for agricultural plant pathology.
- Evaluated PyTorch image classification models on curated field datasets (89.2% validation accuracy).
`;

const CPW_README = `# Coach Prosper’s World (Production Platform)
Status: LIVE (coachprospersworld.org)
Category: Full-Stack / Platform Engineering

Problem:
International youth mentorship organization needed a centralized portal to manage member applications,
voluntary donations, event schedules, and bulk SMS alerts while strictly isolating sensitive applicant records.

Architecture:
- Framework: Next.js App Router (TypeScript)
- Database: PostgreSQL with Prisma ORM (12 relational domains)
- Storage: Dual-tier Vercel Blob (public assets vs private applicant vault)
- Integrations: Paystack Webhook verification (HMAC-SHA512), Arkesel SMS API Gateway
- Authentication: NextAuth.js role-based access control (Admin, Member, Applicant)

Evidence:
- Serving active membership with automated donation verification and SMS delivery.
- Zero credential or applicant data exposure incidents.
`;

const CFSS_README = `# Community Field Survey System (CFSS)
Status: BUILT (Staged with Automated Test Coverage)
Category: Systems & Offline-First Engineering

Problem:
University field researchers capture survey and geospatial data in remote communities
with zero or intermittent network connectivity. Data loss, duplicate drafts, and lack of
spatial validation plagued legacy paper and online-only forms.

Architecture:
- Frontend: Next.js offline-first client with Dexie (IndexedDB) local cache
- Backend: FastAPI (Python 3.11) with Pydantic v2 schemas and connection budgeting
- Spatial: Leaflet GIS with GPS accuracy boundaries and coordinate bounding
- Database: PostgreSQL with relational constraints and Celery worker export tasks
- Resilience: Bi-directional synchronization engine resolving local vs server drafts

Evidence:
- 50+ automated backend integration and role isolation tests.
- Playwright end-to-end recovery test coverage for disconnected survey capture.
`;

const CFSS_ARCHITECTURE = `# CFSS Architecture & Synchronization Protocol

Data Flow:
[Enumerator Tablet]
      │
      ├─ Local Input (Zod schema validation)
      ├─ IndexedDB / Dexie (Offline draft persistence)
      └─ Sync Manager (Network status observer)
            │ (Online event + JWT Bearer)
            ▼
[FastAPI Ingress Gateway]
      │
      ├─ Rate Limiting & TLS Termination
      ├─ Pydantic v2 Payload Validation
      ├─ Role Isolation (Student vs Coordinator vs Admin)
      └─ PostgreSQL ACID Transaction
            │
            ├─ Insert Survey Record
            ├─ Write Audit Log
            └─ Trigger Celery PDF Generator
`;

const CFSS_ENGINEERING = `# CFSS Engineering Decisions & Trade-offs

1. Dexie / IndexedDB over LocalStorage:
   - Reason: LocalStorage is synchronous, blocks the main thread, and is capped at 5MB.
     IndexedDB handles large geospatial survey collections and binary draft attachments smoothly.

2. Deterministic Field-Level Sync over Blind Last-Write-Wins:
   - Reason: Multiple enumerators editing sections must not silently overwrite coordinator notes.

3. Connection Budgeting in FastAPI:
   - Reason: Prevents connection starvation during bulk sync bursts when mobile clients reconnect.
`;

const MASTERY_README = `# MasteryOS (Active Recall Learning Engine)
Status: BUILT (Verified Unit Test Suites)
Category: Application Architecture & Data Systems

Problem:
Passive flashcard flipping leads to the illusion of competence without genuine retrieval effort.
Learners fail to detect foundational prerequisite conceptual bottlenecks.

Architecture:
- Framework: Next.js 15, React 19, TypeScript
- Database: PostgreSQL with Prisma ORM
- Algorithm: Deterministic SuperMemo SM-2 spaced repetition calculation
- Graph Engine: Prerequisite dependency graph modeled as a DAG with DFS cycle detection
- Review Sessions: Reference explanations strictly hidden during active retrieval attempts

Evidence:
- 18 verified unit tests covering SM-2 interval calculations and DAG cycle detection.
`;

const AGRICHEM_README = `# AgriChem Data Research Pipeline
Status: RESEARCH (Machine-Verified Evidence Register)
Category: Data Engineering & Provenance

Problem:
Agricultural chemical usage and residue records in Ghana are fragmented across legacy PDFs,
theses, and regulatory reports with OCR errors and contradictory reporting.

Architecture:
- Language: Python 3.11 (Pandas, Pytest, PDFPlumber, Tesseract OCR)
- Integrity: SHA-256 checksums locking all immutable raw PDF sources
- Evidence: 346 verbatim quotes mechanically mapped to exact page numbers
- Standardization: Canonical long-format dataset (708 observations) with explicit missing-value semantics
`;

const OS_RELEASE_CONTENT = `NAME="Simulated Portfolio Linux"
VERSION="2026.11-LTS (Winyelsum Workstation)"
ID=portfolio-sim
ID_LIKE=debian
PRETTY_NAME="Simulated Portfolio Linux 2026.11 LTS"
VERSION_ID="2026.11"
HOME_URL="https://joshua-winyelsum.vercel.app"
SUPPORT_URL="https://github.com/joshuawinyelsum"
BUG_REPORT_URL="https://github.com/joshuawinyelsum/joshua-portfolio/issues"
SECURITY_POLICY="Closed in-memory simulation; host execution disabled."
`;

const LOG_CONTENT = `2026-11-02 00:00:01 [system] System initialization complete. Kernel: simulated-6.6.14.
2026-11-02 00:00:02 [security] Host filesystem isolation enforced: TRUE.
2026-11-02 00:00:02 [security] Shell interpreter bridge: DISABLED.
2026-11-02 00:00:03 [services] postgresql-16 service started on port 5432.
2026-11-02 00:00:03 [services] redis-server started on port 6379.
2026-11-02 00:00:04 [services] masteryos-daemon background synchronization active.
2026-11-02 01:00:00 [audit] Command interpreter allowlist: 32 commands registered.
2026-11-02 01:45:00 [session] Visitor session started in /home/joshua.
`;

function createVirtualFile(name: string, content: string, permissions = '-rw-r--r--'): VirtualFileEntry {
  return {
    name,
    type: 'file',
    content,
    size: new TextEncoder().encode(content).length,
    permissions,
    owner: 'joshua',
    group: 'joshua',
    modified: '2026-11-02 01:00',
  };
}

function createVirtualDirectory(name: string, children: Record<string, VirtualEntry>, permissions = 'drwxr-xr-x'): VirtualDirectoryEntry {
  return {
    name,
    type: 'directory',
    permissions,
    owner: 'joshua',
    group: 'joshua',
    modified: '2026-11-02 01:00',
    children,
  };
}

/**
 * Predefined, immutable virtual directory structure.
 */
function buildVirtualFilesystem(): VirtualDirectoryEntry {
  const root = createVirtualDirectory('/', {
    home: createVirtualDirectory('home', {
      joshua: createVirtualDirectory('joshua', {
        'README.md': createVirtualFile('README.md', README_CONTENT),
        'ABOUT.md': createVirtualFile('ABOUT.md', ABOUT_CONTENT),
        'CAREER.md': createVirtualFile('CAREER.md', CAREER_CONTENT),
        'SKILLS.md': createVirtualFile('SKILLS.md', SKILLS_CONTENT),
        'RESEARCH.md': createVirtualFile('RESEARCH.md', RESEARCH_CONTENT),
        projects: createVirtualDirectory('projects', {
          'coach-prospers-world': createVirtualDirectory('coach-prospers-world', {
            'README.md': createVirtualFile('README.md', CPW_README),
          }),
          cfss: createVirtualDirectory('cfss', {
            'README.md': createVirtualFile('README.md', CFSS_README),
            'ARCHITECTURE.md': createVirtualFile('ARCHITECTURE.md', CFSS_ARCHITECTURE),
            'ENGINEERING.md': createVirtualFile('ENGINEERING.md', CFSS_ENGINEERING),
          }),
          'mastery-os': createVirtualDirectory('mastery-os', {
            'README.md': createVirtualFile('README.md', MASTERY_README),
          }),
          agrichem: createVirtualDirectory('agrichem', {
            'README.md': createVirtualFile('README.md', AGRICHEM_README),
          }),
        }),
      }),
    }),
    etc: createVirtualDirectory('etc', {
      'os-release': createVirtualFile('os-release', OS_RELEASE_CONTENT),
    }),
    var: createVirtualDirectory('var', {
      log: createVirtualDirectory('log', {
        'portfolio.log': createVirtualFile('portfolio.log', LOG_CONTENT),
      }),
    }),
  });

  return Object.freeze(root);
}

export const VIRTUAL_FS = buildVirtualFilesystem();

/**
 * Normalizes a virtual path safely.
 * Strictly prevents path traversal outside the virtual root.
 * Rejects Windows drive letters, backslashes, or null characters.
 */
export function normalizeVirtualPath(cwd: string, inputPath?: string): { success: boolean; path: string; error?: string } {
  if (!inputPath || inputPath.trim() === '') {
    return { success: true, path: cwd };
  }

  const raw = inputPath.trim();

  // Reject Windows-style drive letters, backslashes, and null characters
  if (/[a-zA-Z]:|[\\|\0]/.test(raw)) {
    return {
      success: false,
      path: cwd,
      error: 'Invalid path syntax: Windows drive paths and backslashes are not supported in virtual paths.',
    };
  }

  let workingPath = raw;

  // Handle home shortcut '~'
  if (workingPath === '~' || workingPath.startsWith('~/')) {
    workingPath = workingPath === '~' ? '/home/joshua' : '/home/joshua' + workingPath.substring(1);
  } else if (!workingPath.startsWith('/')) {
    workingPath = cwd === '/' ? `/${workingPath}` : `${cwd}/${workingPath}`;
  }

  // Tokenize segments and resolve '.' and '..'
  const rawSegments = workingPath.split('/');
  const resolvedSegments: string[] = [];

  for (const seg of rawSegments) {
    if (!seg || seg === '.') {
      continue;
    }
    if (seg === '..') {
      // Reaching root boundary: cannot traverse above '/'
      if (resolvedSegments.length > 0) {
        resolvedSegments.pop();
      }
    } else {
      resolvedSegments.push(seg);
    }
  }

  const finalPath = '/' + resolvedSegments.join('/');
  return { success: true, path: finalPath };
}

/**
 * Resolves an entry in the virtual filesystem.
 */
export function getVirtualEntry(path: string): VirtualEntry | null {
  if (path === '/') return VIRTUAL_FS;

  const segments = path.split('/').filter(Boolean);
  let current: VirtualEntry = VIRTUAL_FS;

  for (const seg of segments) {
    if (current.type !== 'directory') return null;
    const next: VirtualEntry | undefined = current.children[seg];
    if (!next) return null;
    current = next;
  }

  return current;
}

/**
 * Lists contents of a directory.
 */
export function listVirtualDirectory(path: string): VirtualEntry[] | null {
  const entry = getVirtualEntry(path);
  if (!entry || entry.type !== 'directory') return null;

  return Object.values(entry.children);
}

/**
 * Reads the text content of a virtual file.
 */
export function readVirtualFile(path: string): { success: boolean; content?: string; error?: string } {
  const entry = getVirtualEntry(path);
  if (!entry) {
    return { success: false, error: `No such file or directory: ${path}` };
  }
  if (entry.type !== 'file') {
    return { success: false, error: `Is a directory: ${path}` };
  }
  return { success: true, content: entry.content };
}

/**
 * Generates an ASCII tree of the virtual filesystem.
 */
export function generateAsciiTree(startPath = '/'): string {
  const rootEntry = getVirtualEntry(startPath);
  if (!rootEntry) return `Cannot access '${startPath}': No such file or directory`;

  const lines: string[] = [startPath];

  function traverse(dir: VirtualDirectoryEntry, prefix: string) {
    const entries = Object.values(dir.children);
    entries.sort((a, b) => {
      // Directories first, then alphabetical
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    entries.forEach((entry, idx) => {
      const isLast = idx === entries.length - 1;
      const branch = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');

      if (entry.type === 'directory') {
        lines.push(`${prefix}${branch}${entry.name}/`);
        traverse(entry, nextPrefix);
      } else {
        lines.push(`${prefix}${branch}${entry.name}`);
      }
    });
  }

  if (rootEntry.type === 'directory') {
    traverse(rootEntry, '');
  } else {
    lines.push(`└── ${rootEntry.name}`);
  }

  return lines.join('\n');
}

/**
 * Recursively finds entries matching a search term or pattern.
 */
export function findVirtualEntries(startPath = '/', query?: string): string[] {
  const results: string[] = [];
  const rootEntry = getVirtualEntry(startPath);
  if (!rootEntry) return results;

  function walk(current: VirtualEntry, currentPath: string) {
    const matches = !query || current.name.toLowerCase().includes(query.toLowerCase());
    if (matches) {
      results.push(currentPath);
    }
    if (current.type === 'directory') {
      for (const [name, child] of Object.entries(current.children)) {
        const nextPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
        walk(child, nextPath);
      }
    }
  }

  walk(rootEntry, startPath);
  return results;
}
