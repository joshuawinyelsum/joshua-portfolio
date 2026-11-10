import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Credential } from '../../types';
import { Button } from '../ui/Button';
import { DownloadCertificate } from './DownloadCertificate';

interface CertificateLightboxProps {
  /** Certificates that have an image, in gallery order. */
  credentials: Credential[];
  /** Index of the open certificate, or null when closed. */
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

/**
 * Full-size certificate viewer.
 *
 * Built on the native dialog, which traps focus, closes on Escape and hands
 * focus back to the control that opened it. Left and right arrows move
 * between certificates. Clicking the image switches between fitting the
 * screen and its full resolution, where the stage scrolls so every line of
 * the certificate can be read.
 */
export function CertificateLightbox({ credentials, index, onChange, onClose }: CertificateLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);

  const open = index !== null;
  const credential = open ? credentials[index] : undefined;
  const count = credentials.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Each certificate starts fitted to the screen.
  useEffect(() => {
    setZoomed(false);
  }, [index]);

  const step = (delta: number) => {
    if (index === null || count < 2) return;
    onChange((index + delta + count) % count);
  };

  return (
    <dialog
      ref={dialogRef}
      className={`lightbox ${zoomed ? 'lightbox--zoomed' : ''}`}
      aria-label={credential ? `${credential.title} certificate, ${credential.issuer}` : 'Certificate'}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') step(1);
        if (event.key === 'ArrowLeft') step(-1);
      }}
      onClick={(event) => {
        // A click that lands on the dialog itself is a click on the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {credential?.image && (
        <>
          <div className="lightbox__header">
            <p className="min-w-0 text-small">
              <span className="font-semibold">{credential.title}</span>
              <span className="text-white/70"> · {credential.issuer}</span>
              {count > 1 && (
                <span className="text-white/70">
                  {' '}
                  · {index! + 1} of {count}
                </span>
              )}
            </p>
            <Button variant="icon" size="sm" onClick={onClose} aria-label="Close certificate viewer">
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </div>

          <div className="lightbox__stage" onClick={(event) => event.target === event.currentTarget && onClose()}>
            <img
              className="lightbox__image"
              src={credential.image.src}
              alt={credential.image.alt}
              width={credential.image.width}
              height={credential.image.height}
              onClick={() => setZoomed((value) => !value)}
            />
          </div>

          <div className="lightbox__bar">
            {count > 1 && (
              <Button variant="icon" size="sm" onClick={() => step(-1)} aria-label="Previous certificate">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>
              {zoomed ? 'Fit to screen' : 'Full resolution'}
            </Button>
            {credential.pdfUrl && <DownloadCertificate pdfUrl={credential.pdfUrl} title={credential.title} />}
            {count > 1 && (
              <Button variant="icon" size="sm" onClick={() => step(1)} aria-label="Next certificate">
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
