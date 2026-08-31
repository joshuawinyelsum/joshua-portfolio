import { EducationItem, Credential } from '../types';

export const education: EducationItem[] = [
  {
    institution: 'University for Development Studies',
    degree: 'BSc Computer Science',
    location: 'Tamale, Ghana',
    status: 'Currently pursuing',
    coursework: [
      'Computer Organization',
      'Systems Analysis & Design',
      'Visual Programming',
      'Database Systems',
    ],
  },
];

export const credentials: Credential[] = [
  {
    issuer: 'Google',
    title: 'Foundations of Cybersecurity',
    score: '94.52%',
    type: 'Google Career Certificate',
  },
  {
    issuer: 'TechXtraMile',
    title: 'Google Career Certificate Scholarship Program',
    type: 'Scholarship',
    year: '2026',
  },
];
