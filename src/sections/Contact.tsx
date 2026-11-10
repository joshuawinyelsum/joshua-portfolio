import { ScrollReveal } from '../components/ScrollReveal';
import { ContactForm } from '../components/contact/ContactForm';
import { SocialLinks } from '../components/contact/SocialLinks';
import { LayeredSurface } from '../components/ui/LayeredSurface';
import { contactInfo } from '../data/social';

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-content grid items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Invitation and direct contact */}
        <div>
          <ScrollReveal>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-5 text-headline font-bold text-ink text-balance">
              Let's build something <span className="text-accent">useful</span>.
            </h2>
            <p className="mt-6 max-w-md text-lead text-ink-soft">
              Have a problem worth solving, a system worth building, or an interesting research
              question? Let's talk.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <dl className="rows mt-10 max-w-md">
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="text-eyebrow font-semibold uppercase text-ink-muted">Email</dt>
                <dd>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="break-all text-body font-semibold text-ink transition-colors duration-fast hover:text-accent"
                  >
                    {contactInfo.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="text-eyebrow font-semibold uppercase text-ink-muted">Phone</dt>
                <dd>
                  <a
                    href="tel:+233247932712"
                    className="text-body font-semibold text-ink transition-colors duration-fast hover:text-accent"
                  >
                    {contactInfo.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </ScrollReveal>

          <ScrollReveal delay={180} className="mt-8">
            <p className="text-eyebrow font-semibold uppercase text-ink-muted">@joshuawinyelsum</p>
            <div className="mt-3">
              <SocialLinks />
            </div>
          </ScrollReveal>
        </div>

        {/* Message form: one plain surface, no decoration */}
        <ScrollReveal delay={120}>
          <LayeredSurface stack="none" faceClassName="p-card md:p-9">
            <ContactForm />
          </LayeredSurface>
        </ScrollReveal>
      </div>
    </section>
  );
}
