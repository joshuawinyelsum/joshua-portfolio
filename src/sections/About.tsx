import { SectionHeader } from '../components/SectionHeader';
import { MetadataItem } from '../components/MetadataItem';
import { ScrollReveal } from '../components/ScrollReveal';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 section-padding bg-white">
      <div className="max-w-4xl">
        <SectionHeader title="About Me" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <ScrollReveal>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-semibold">
                I'm Joshua Winyelsum, a Computer Science student at the University for Development Studies and a software engineer focused on backend systems, database architecture, and data pipelines.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                My engineering focus centers on building resilient application architectures with FastAPI, Next.js, and PostgreSQL, designing clean relational schemas with Prisma and SQLAlchemy, and ensuring offline reliability with client-side persistence like IndexedDB.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                I treat software development as an evidence-driven discipline: architectures must be supported by automated test suites, defensive error handling, and defensible performance constraints rather than unsubstantiated claims.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                Alongside application engineering, I conduct data systems research—investigating fragmented regulatory datasets, extraction pipelines, and canonical schema harmonization, especially within real-world environments like Ghana's agricultural-chemical sector.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                Currently pursuing my BSc in Computer Science at UDS, I continuously bridge academic foundations in systems analysis, database theory, and data structures with practical production engineering.
              </p>
            </ScrollReveal>
          </div>

          {/* Metadata sidebar */}
          <div>
            <MetadataItem label="From" value="Bawku, Upper East Region, Ghana" delay={100} />
            <MetadataItem label="Currently" value="Tamale, Ghana" delay={160} />
            <MetadataItem label="Education" value="BSc Computer Science — UDS" delay={220} />
            <MetadataItem label="Languages" value="English · Kusaal" delay={280} />
          </div>
        </div>
      </div>
    </section>
  );
}
