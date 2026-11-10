import { ExperienceItem } from '../types';

export const experience: ExperienceItem[] = [
  {
    company: 'Coach Prosper’s World',
    role: 'Software & Technology Lead',
    description: 'Lead engineer for the organization’s digital platform and administrative systems, architecting full-stack web applications, automated SMS messaging, and donation workflows.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Paystack', 'Arkesel SMS'],
  },
  {
    company: 'UNICEF StartUp Lab',
    programme: 'AI for Nurturing Care Hackathon 2026',
    role: 'Full-stack and design',
    description: 'Built the CHPS Progressive Web App and interface for MABIA AI, an offline-first voice outreach, maternal emergency response and nutrition coordination platform for community healthcare in Northern Ghana, in a team of three.',
    technologies: ['React', 'Vite', 'PWA', 'IndexedDB'],
    project: {
      name: 'MABIA AI',
      url: 'https://mabia-ai.vercel.app/login',
      evidencePath: '/case-study/mabia-ai',
    },
  },
  {
    company: 'Codveda Technologies',
    role: 'Full-Stack Development Intern',
    description: 'Practical full-stack development experience working with modern web technologies and application development.',
    technologies: ['MERN'],
  },
];
