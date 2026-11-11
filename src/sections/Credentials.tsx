import { SectionHeader } from '../components/SectionHeader';
import { CredentialGallery } from '../components/credentials/CredentialGallery';
import { credentials } from '../data/education';

export function Credentials() {
  return (
    <section id="credentials" className="section">
      <div className="container-content">
        <SectionHeader title="Certifications & Credentials" />
        <CredentialGallery credentials={credentials} />
      </div>
    </section>
  );
}
