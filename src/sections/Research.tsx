import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowLink } from '../components/ui/ArrowLink';
import { LayeredSurface } from '../components/ui/LayeredSurface';
import { Tag } from '../components/ui/Tag';
import { researchAreas, researchSources } from '../data/research';

const pipeline = ['Data Sources', 'Datasets', 'Schema', 'Canonical Structure', 'Usable Data'];

export function Research() {
  return (
    <section id="research" className="section pb-24 sm:pb-28">
      <div className="container-content">
        <SectionHeader
          title="Research & Data"
          subtitle={`"Researching the gaps between data and reality."`}
          accent="data and reality."
        />

        <div className="grid items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Featured research: clean high-contrast surface without decorative stacked sheets */}
          <ScrollReveal>
            <LayeredSurface tone="inverse" stack="none" faceClassName="p-card lg:p-9">
              <p className="eyebrow eyebrow--on-inverse">Featured Research</p>
              <h3 className="mt-5 text-title-lg font-bold">Ghana Agricultural-Chemical Data Landscape</h3>
              <p className="mt-4 text-body text-on-inverse-muted">
                An evidence-backed investigation into Ghana's agricultural-chemical data ecosystem, focusing on
                how information is distributed, represented, validated, and connected across regulatory and academic sources.
              </p>
              <ArrowLink to="/case-study/agrichem" onInverse className="mt-7">
                Explore Research Case Study
              </ArrowLink>
            </LayeredSurface>
          </ScrollReveal>

          {/* Research areas */}
          <ol className="rows lg:-mt-4">
            {researchAreas.map((area, index) => (
              <li key={area.title}>
                <ScrollReveal delay={index * 60} className="flex items-baseline gap-5 py-4">
                  <span className="text-small font-semibold tabular-nums text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-body font-bold text-ink">{area.title}</h4>
                    <p className="mt-0.5 text-small text-ink-soft">{area.description}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Research pipeline */}
          <ScrollReveal>
            <h3 className="text-eyebrow font-semibold uppercase text-ink-muted">Research Pipeline</h3>
            <ol className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-small font-medium text-ink">
              {pipeline.map((step, i) => (
                <li key={step} className="flex items-center gap-2.5">
                  <span className={i === pipeline.length - 1 ? 'text-accent' : ''}>{step}</span>
                  {i < pipeline.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </ScrollReveal>

          {/* Sources investigated */}
          <ScrollReveal delay={80}>
            <h3 className="text-eyebrow font-semibold uppercase text-ink-muted">Sources Investigated</h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {researchSources.map((source) => (
                <li key={source.abbreviation || source.name}>
                  <Tag title={source.name}>{source.abbreviation || source.name}</Tag>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
