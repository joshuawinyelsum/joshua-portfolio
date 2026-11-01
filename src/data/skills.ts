import { Skill } from '../types';

export const skills: Skill[] = [
  // Languages
  { name: 'TypeScript', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Python', category: 'Languages', linkedProjects: ['cfss', 'agrichem'] },
  { name: 'JavaScript', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'SQL', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'HTML / CSS', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },

  // Backend & Systems
  { name: 'FastAPI', category: 'Backend & Systems', linkedProjects: ['cfss'] },
  { name: 'Next.js (App Router)', category: 'Backend & Systems', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Node.js', category: 'Backend & Systems', linkedProjects: ['coach-prospers-world'] },
  { name: 'REST APIs', category: 'Backend & Systems', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Authentication (JWT / NextAuth)', category: 'Backend & Systems', linkedProjects: ['coach-prospers-world', 'cfss'] },

  // Data & Storage
  { name: 'PostgreSQL', category: 'Data & Storage', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Prisma ORM', category: 'Data & Storage', linkedProjects: ['coach-prospers-world', 'mastery-os'] },
  { name: 'IndexedDB (Dexie)', category: 'Data & Storage', linkedProjects: ['cfss'] },
  { name: 'Schema Design & Relational Modeling', category: 'Data & Storage', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Data Pipeline Validation', category: 'Data & Storage', linkedProjects: ['agrichem'] },

  // Frontend & UI
  { name: 'React', category: 'Frontend', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Tailwind CSS', category: 'Frontend', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os'] },
  { name: 'Leaflet / GIS Mapping', category: 'Frontend', linkedProjects: ['cfss'] },
  { name: 'React Flow (Graphs)', category: 'Frontend', linkedProjects: ['mastery-os'] },

  // Engineering & Reliability
  { name: 'Git & GitHub', category: 'Engineering & Reliability', linkedProjects: ['coach-prospers-world', 'cfss', 'mastery-os', 'agrichem'] },
  { name: 'Automated Testing (Vitest / Pytest)', category: 'Engineering & Reliability', linkedProjects: ['mastery-os', 'cfss', 'agrichem', 'coach-prospers-world'] },
  { name: 'E2E Testing (Playwright)', category: 'Engineering & Reliability', linkedProjects: ['cfss', 'coach-prospers-world'] },
  { name: 'Linux / Shell', category: 'Engineering & Reliability', linkedProjects: ['coach-prospers-world', 'cfss', 'agrichem'] },
  { name: 'Webhook & Idempotency Engineering', category: 'Engineering & Reliability', linkedProjects: ['coach-prospers-world'] },
];

export const skillCategories = [
  'Languages',
  'Backend & Systems',
  'Data & Storage',
  'Frontend',
  'Engineering & Reliability',
];
