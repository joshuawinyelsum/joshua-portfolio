import { Skill } from '../types';

export const skills: Skill[] = [
  // Languages
  { name: 'Python', category: 'Languages', linkedProjects: ['cropmind', 'agrichem'] },
  { name: 'JavaScript', category: 'Languages', linkedProjects: ['cfss'] },
  { name: 'HTML', category: 'Languages', linkedProjects: ['cfss'] },
  { name: 'CSS', category: 'Languages', linkedProjects: ['cfss'] },
  { name: 'SQL', category: 'Languages', linkedProjects: [] },
  // Frontend
  { name: 'React', category: 'Frontend', linkedProjects: ['cfss'] },
  { name: 'Vite', category: 'Frontend', linkedProjects: ['cfss'] },
  // Backend
  { name: 'FastAPI', category: 'Backend', linkedProjects: ['cfss'] },
  { name: 'Node.js', category: 'Backend', linkedProjects: [] },
  { name: 'Express', category: 'Backend', linkedProjects: [] },
  // Data & Storage
  { name: 'MongoDB', category: 'Data & Storage', linkedProjects: [] },
  { name: 'IndexedDB', category: 'Data & Storage', linkedProjects: ['cfss'] },
  { name: 'JSON', category: 'Data & Storage', linkedProjects: ['cfss', 'agrichem'] },
  { name: 'SQL', category: 'Data & Storage', linkedProjects: [] },
  // AI / ML
  { name: 'Machine Learning', category: 'AI / ML', linkedProjects: ['cropmind'] },
  { name: 'Computer Vision', category: 'AI / ML', linkedProjects: ['cropmind'] },
  { name: 'Data Processing', category: 'AI / ML', linkedProjects: ['agrichem', 'cropmind'] },
  // Engineering
  { name: 'Git', category: 'Engineering', linkedProjects: ['cfss', 'cropmind', 'agrichem'] },
  { name: 'GitHub', category: 'Engineering', linkedProjects: ['cfss', 'cropmind', 'agrichem'] },
  { name: 'REST APIs', category: 'Engineering', linkedProjects: ['cfss'] },
  { name: 'JWT', category: 'Engineering', linkedProjects: ['cfss'] },
  { name: 'Linux / CLI', category: 'Engineering', linkedProjects: [] },
  { name: 'Postman', category: 'Engineering', linkedProjects: ['cfss'] },
];

export const skillCategories = [
  'Languages',
  'Frontend',
  'Backend',
  'Data & Storage',
  'AI / ML',
  'Engineering',
];
