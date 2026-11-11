import { EducationItem, Credential } from '../types';

export const education: EducationItem[] = [
  {
    institution: 'University for Development Studies',
    degree: 'BSc Computer Science',
    location: 'Tamale, Ghana',
    status: 'Currently pursuing',
    currentLevel: 'Level 200',
    gpa: '4.69 / 5.00 GPA',
    coursework: [
      'Computer Organization',
      'Systems Analysis & Design',
      'Visual Programming',
      'Database Systems',
    ],
  },
];

/**
 * Verified credentials. Every field is taken from the certificate itself
 * (see the PDFs in public/certificates/), except where noted.
 *
 * To add another certificate:
 *   1. Save the original PDF in public/certificates/.
 *   2. Render its first page to public/images/credentials/ (the existing
 *      previews are 2400 px on the long edge, JPEG quality 92).
 *   3. Add an entry below with the title, issuer and details printed on it.
 */
export const credentials: Credential[] = [
  {
    issuer: 'HackerRank',
    title: 'Frontend Developer (React)',
    type: 'Certificate of Accomplishment · Role certification',
    status: 'Passed',
    date: 'November 10, 2026',
    dateISO: '2026-11-10',
    credentialId: 'DF8E62446F77',
    image: {
      src: '/images/credentials/hackerrank-frontend-developer-react.jpg',
      alt: 'HackerRank Certificate of Accomplishment for Frontend Developer (React), presented to Joshua Winyelsum, earned on 10 November 2026, ID DF8E62446F77',
      width: 2400,
      height: 1829,
    },
    pdfUrl: '/certificates/hackerrank-frontend-developer-react.pdf',
  },
  {
    issuer: 'Google · Coursera',
    title: 'Foundations of Cybersecurity',
    type: 'Course certificate',
    // The grade is as previously recorded on this site; it is not printed on the certificate.
    score: '94.52%',
    date: 'July 13, 2026',
    dateISO: '2026-07-13',
    credentialId: '4NTZQE5A3OLS',
    verifyUrl: 'https://coursera.org/verify/4NTZQE5A3OLS',
    program: 'TechXtraMile · Google Career Certificate Scholarship Program',
    image: {
      src: '/images/credentials/coursera-foundations-of-cybersecurity.jpg',
      alt: 'Coursera course certificate: Joshua Akum has successfully completed Foundations of Cybersecurity, an online course authorized by Google, dated 13 July 2026',
      width: 2400,
      height: 1855,
    },
    pdfUrl: '/certificates/coursera-foundations-of-cybersecurity.pdf',
  },
];
