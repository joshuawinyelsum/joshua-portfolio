import { Skill } from '../types';

export const skills: Skill[] = [
  // Languages
  { name: 'Python', category: 'Languages', linkedProjects: ['cropmind', 'agrichem'] },
  { name: 'TypeScript', category: 'Languages', linkedProjects: ['coach-prospers-world'] },
  { name: 'JavaScript', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss'] },
  { name: 'HTML', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss'] },
  { name: 'CSS', category: 'Languages', linkedProjects: ['coach-prospers-world', 'cfss'] },
  { name: 'SQL', category: 'Languages', linkedProjects: ['coach-prospers-world'] },
  // Frontend
  { name: 'React', category: 'Frontend', linkedProjects: ['coach-prospers-world', 'cfss'] },
  { name: 'Next.js', category: 'Frontend', linkedProjects: ['coach-prospers-world'] },
  { name: 'Vite', category: 'Frontend', linkedProjects: ['cfss'] },
  // Backend
  { name: 'FastAPI', category: 'Backend', linkedProjects: ['cfss'] },
  { name: 'Node.js', category: 'Backend', linkedProjects: ['coach-prospers-world'] },
  { name: 'Express', category: 'Backend', linkedProjects: [] },
  // Data & Storage
  { name: 'PostgreSQL', category: 'Data & Storage', linkedProjects: ['coach-prospers-world'] },
  { name: 'Prisma ORM', category: 'Data & Storage', linkedProjects: ['coach-prospers-world'] },
  { name: 'MongoDB', category: 'Data & Storage', linkedProjects: [] },
  { name: 'IndexedDB', category: 'Data & Storage', linkedProjects: ['cfss'] },
  { name: 'JSON', category: 'Data & Storage', linkedProjects: ['coach-prospers-world', 'cfss', 'agrichem'] },
  // AI / ML
  { name: 'Machine Learning', category: 'AI / ML', linkedProjects: ['cropmind'] },
  { name: 'Computer Vision', category: 'AI / ML', linkedProjects: ['cropmind'] },
  { name: 'Data Processing', category: 'AI / ML', linkedProjects: ['agrichem', 'cropmind'] },
  // Engineering
  { name: 'Git', category: 'Engineering', linkedProjects: ['coach-prospers-world', 'cfss', 'cropmind', 'agrichem'] },
  { name: 'GitHub', category: 'Engineering', linkedProjects: ['coach-prospers-world', 'cfss', 'cropmind', 'agrichem'] },
  { name: 'REST APIs', category: 'Engineering', linkedProjects: ['coach-prospers-world', 'cfss'] },
  { name: 'JWT', category: 'Engineering', linkedProjects: ['coach-prospers-world', 'cfss'] },
  { name: 'Linux / CLI', category: 'Engineering', linkedProjects: ['coach-prospers-world'] },
  { name: 'Postman', category: 'Engineering', linkedProjects: ['coach-prospers-world', 'cfss'] },
];

export const skillCategories = [
  'Languages',
  'Frontend',
  'Backend',
  'Data & Storage',
  'AI / ML',
  'Engineering',
];
