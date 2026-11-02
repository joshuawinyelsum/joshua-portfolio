import { ScrollReveal } from '../components/ScrollReveal';
import { socialLinks, contactInfo } from '../data/social';

export function Contact() {
  return (
    <section id="contact" className="py-28 md:py-36 section-padding bg-[#1A1A1A] dark:bg-[#131417] text-white">
      <div className="max-w-4xl">
        <ScrollReveal>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-600 dark:text-neutral-500 mb-6">
            Contact
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white dark:text-[#ededeb] tracking-tight mb-6 text-balance">
            Let's build something useful.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <p className="text-base md:text-[17px] text-gray-400 dark:text-neutral-400 leading-relaxed mb-2 max-w-xl">
            Have a problem worth solving, a system worth building, or an interesting research
            question?
          </p>
          <p className="text-base md:text-[17px] text-gray-400 dark:text-neutral-400 leading-relaxed mb-14 max-w-xl">
            Let's talk.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* Direct contact */}
          <ScrollReveal delay={160}>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 dark:text-neutral-500 mb-3">
                  Email
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group inline-flex items-center gap-2 text-base md:text-lg text-white dark:text-[#ededeb] hover:text-blue-400 break-all transition-colors duration-300"
                >
                  {contactInfo.email}
                  <svg
                    className="w-4 h-4 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 dark:text-neutral-500 mb-3">
                  Phone
                </p>
                <a
                  href="tel:+233247932712"
                  className="group inline-flex items-center gap-2 text-base md:text-lg text-white dark:text-[#ededeb] hover:text-blue-400 transition-colors duration-300"
                >
                  {contactInfo.phone}
                  <svg
                    className="w-4 h-4 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Social links */}
          <ScrollReveal delay={240}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 dark:text-neutral-500 mb-5">
                @joshuawinyelsum
              </p>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-4 py-2.5 text-sm font-medium text-gray-400 dark:text-neutral-400 border border-gray-700/80 dark:border-[#282a32] rounded-lg hover:text-white dark:hover:text-[#ededeb] hover:border-gray-500 dark:hover:border-neutral-500 hover:bg-white/[0.03] transition-all duration-300"
                    aria-label={`Visit ${link.platform} profile`}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
