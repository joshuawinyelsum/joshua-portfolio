import { SectionHeader } from '../components/SectionHeader';
import { MetadataItem } from '../components/MetadataItem';
import { ScrollReveal } from '../components/ScrollReveal';
import { LayeredSurface } from '../components/ui/LayeredSurface';

export function About() {
  return (
    <section id="about" className="section">
      <div className="container-content">
        <SectionHeader title="About Me" />

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          {/* Main content */}
          <div className="space-y-5">
            <ScrollReveal>
              <p className="text-title font-semibold text-ink md:text-xl md:leading-relaxed">
                I'm Joshua Winyelsum, a Computer Science student at the University for Development Studies and a software engineer focused on backend systems, database architecture, and data pipelines.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p className="text-body text-ink-soft">
                My engineering focus centers on building resilient application architectures with FastAPI, Next.js, and PostgreSQL, designing clean relational schemas with Prisma and SQLAlchemy, and ensuring offline reliability with client-side persistence like IndexedDB.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="text-body text-ink-soft">
                I treat software development as an evidence-driven discipline: architectures must be supported by automated test suites, defensive error handling, and defensible performance constraints rather than unsubstantiated claims.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-body text-ink-soft">
                Alongside application engineering, I conduct data systems research, investigating fragmented regulatory datasets, extraction pipelines, and canonical schema harmonization, especially within real-world environments like Ghana's agricultural-chemical sector.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <p className="text-body text-ink-soft">
                Currently pursuing my BSc in Computer Science at UDS, I continuously bridge academic foundations in systems analysis, database theory, and data structures with practical production engineering.
              </p>
            </ScrollReveal>
          </div>

          {/* Metadata */}
          <ScrollReveal delay={120}>
            <LayeredSurface tone="inverse" stack="none">
              <dl className="space-y-6">
                <MetadataItem onInverse label="From" value="Bawku, Upper East Region, Ghana" />
                <MetadataItem onInverse label="Currently" value="Tamale, Ghana" />
                <MetadataItem onInverse label="Education" value="BSc Computer Science, UDS" />
                <MetadataItem onInverse label="Languages" value="English · Kusaal" />
              </dl>
            </LayeredSurface>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
