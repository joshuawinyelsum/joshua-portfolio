import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface DownloadCertificateProps {
  /** The original PDF: a path under /public or the issuer's own URL. */
  pdfUrl: string;
  title: string;
}

const isLocal = (url: string) => url.startsWith('/');

/**
 * The Download PDF action. A PDF hosted with the site is downloaded
 * directly; one hosted by the issuer opens in a new tab, because browsers
 * ignore the download hint across origins.
 */
export function DownloadCertificate({ pdfUrl, title }: DownloadCertificateProps) {
  const local = isLocal(pdfUrl);

  return (
    <Button
      href={pdfUrl}
      size="sm"
      external={!local}
      download={local ? `${title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}.pdf` : undefined}
      leading={<Download className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
      aria-label={`Download the ${title} certificate as a PDF`}
    >
      Download PDF
    </Button>
  );
}
