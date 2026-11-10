import { Maximize2 } from 'lucide-react';
import { Credential } from '../../types';
import { ArrowLink } from '../ui/ArrowLink';
import { DownloadCertificate } from './DownloadCertificate';

interface CertificateCardProps {
  credential: Credential;
  /** Opens the lightbox on this certificate. */
  onView: () => void;
}

/** The facts worth a line under the title, in the order a reader wants them. */
function details(credential: Credential) {
  return [
    credential.status,
    credential.score && `Grade ${credential.score}`,
    credential.date,
  ].filter(Boolean) as string[];
}

/**
 * One certificate in the gallery: the authentic image, then its title,
 * issuer and achievement, with actions to view it and download the PDF.
 * No card surface; the certificate itself is the object.
 */
export function CertificateCard({ credential, onView }: CertificateCardProps) {
  const { image, pdfUrl, verifyUrl } = credential;
  const facts = details(credential);

  return (
    <article className="flex h-full flex-col">
      {image && (
        <button
          type="button"
          className="certificate"
          onClick={onView}
          aria-label={`View the ${credential.title} certificate from ${credential.issuer} at full size`}
        >
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
          <span className="certificate__hint" aria-hidden="true">
            <Maximize2 className="h-3 w-3" strokeWidth={2} />
            View larger
          </span>
        </button>
      )}

      <p className="mt-6 text-eyebrow font-semibold uppercase text-ink-muted">{credential.issuer}</p>
      <h3 className="mt-2 text-title font-bold text-ink">{credential.title}</h3>
      <p className="mt-1 text-small text-ink-soft">{credential.type}</p>

      {facts.length > 0 && (
        <p className="mt-3 text-small font-medium text-ink">
          {facts.map((fact, index) => (
            <span key={fact}>
              {index > 0 && <span className="mx-2 text-ink-muted">·</span>}
              {fact === credential.date ? <time dateTime={credential.dateISO}>{fact}</time> : fact}
            </span>
          ))}
        </p>
      )}

      {credential.program && <p className="mt-1 text-small text-ink-muted">{credential.program}</p>}
      {credential.credentialId && (
        <p className="mt-1 text-caption text-ink-muted">
          Credential ID <span className="font-mono">{credential.credentialId}</span>
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-6">
        {pdfUrl && <DownloadCertificate pdfUrl={pdfUrl} title={credential.title} />}
        {image && <ArrowLink onClick={onView}>View certificate</ArrowLink>}
        {verifyUrl && (
          <ArrowLink href={verifyUrl} external>
            Verify
          </ArrowLink>
        )}
      </div>
    </article>
  );
}
