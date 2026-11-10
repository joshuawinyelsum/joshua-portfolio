import { useState } from 'react';
import { Credential } from '../../types';
import { ScrollReveal } from '../ScrollReveal';
import { CertificateCard } from './CertificateCard';
import { CertificateLightbox } from './CertificateLightbox';

interface CredentialGalleryProps {
  credentials: Credential[];
}

/**
 * Data-driven gallery of certificates. Add a credential to the data and it
 * appears here with its image, details, lightbox and PDF download; there is
 * nothing to build per certificate.
 */
export function CredentialGallery({ credentials }: CredentialGalleryProps) {
  // The lightbox pages through the certificates that have an image.
  const viewable = credentials.filter((credential) => credential.image);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={`grid gap-x-12 gap-y-14 md:grid-cols-2 ${credentials.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
        {credentials.map((credential, index) => (
          <li key={credential.title}>
            <ScrollReveal delay={index * 90} className="h-full">
              <CertificateCard credential={credential} onView={() => setOpenIndex(viewable.indexOf(credential))} />
            </ScrollReveal>
          </li>
        ))}
      </ul>

      <CertificateLightbox
        credentials={viewable}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
